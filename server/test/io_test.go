package test

import (
	"bytes"
	"flag"
	"fmt"
	"github.com/lonng/nano/benchmark/wsio"
	"github.com/lonng/nano/serialize/protobuf"
	"happy-fish/pkg/z"
	proto2 "happy-fish/proto/proto"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"
)

func HttpRequest(path string, params interface{}) ([]byte, error) {
	var (
		url      = "http://127.0.0.1:8000/v1/" + path
		ss       = protobuf.NewSerializer()
		err      error
		input    []byte
		req      *http.Request
		client   *http.Client
		response *http.Response
	)
	input, err = ss.Marshal(params)
	if err != nil {
		return nil, err
	}
	req, err = http.NewRequest("POST", url, bytes.NewReader(input))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-protobuf")
	client = &http.Client{}
	response, err = client.Do(req)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	return ioutil.ReadAll(response.Body)
}

func client(deviceId, rid string) {
	var (
		ss   = protobuf.NewSerializer()
		data []byte
		err  error
		path string
		uid  string
		c    *wsio.Connector
	)
	data, err = HttpRequest("login", &proto2.AccountLoginReq{
		Partition: proto2.AccountType_DEVICEID,
		AccountId: deviceId,
		Password:  "123",
	})

	resp := &proto2.AccountLoginResp{}
	if err = ss.Unmarshal(data, resp); err != nil {
		log.Println("Error unmarshaling response", err)
		return
	}
	switch resp.Code {
	case proto2.ErrorCode_NeedRegisterError:
		data, err = HttpRequest("register", &proto2.AccountRegisterReq{
			AccountId: deviceId,
			Password:  "123",
		})
		resp1 := &proto2.AccountRegisterResp{}
		if err = ss.Unmarshal(data, resp1); err != nil {
			log.Println("Error unmarshaling response", err)
			return
		}
		path = resp1.Addr
	case proto2.ErrorCode_OK:
		path = resp.Addr
		uid = resp.UserId
	}
	fmt.Println(path, uid)
	// 长链接
	c = wsio.NewConnector()
	chReady := make(chan struct{})
	c.OnConnected(func() {
		chReady <- struct{}{}
	})
	if err = c.Start(path, "/nano"); err != nil {
		panic(err)
	}
	<-chReady
	chLogin := make(chan struct{})
	chEnd := make(chan interface{}, 0)
	state := proto2.GameState_IDLE
	if uid == "" {
		c.Request("g.register", &proto2.RegisterGameReq{Name: deviceId, AccountId: deviceId}, func(data interface{}) {
			chLogin <- struct{}{}
			v := proto2.LoginToGameResp{}
			ss.Unmarshal(data.([]byte), &v)
			ss.Unmarshal(data.([]byte), &v)
			fmt.Println(deviceId, "register", v)
		})
	} else {
		c.Request("g.login", &proto2.LoginToGame{UserId: uid}, func(data interface{}) {
			chLogin <- struct{}{}
			v := proto2.LoginToGameResp{}
			ss.Unmarshal(data.([]byte), &v)
			fmt.Println(deviceId, "login", v)
		})
	}
	<-chLogin
	c.On("onTableAction", func(data interface{}) {
		v := proto2.OnTableAction{}
		ss.Unmarshal(data.([]byte), &v)
		log.Println("onTableAction", v.Action)
	})
	ra := z.RandInt(1, 2)
	ticker := time.NewTicker(time.Duration(ra) * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-chEnd:
			fmt.Println("游戏结束了", uid)
			c.Close()
			return
		case <-ticker.C:
			switch state {
			case proto2.GameState_IDLE:
				c.Request("r.quickstart", &proto2.QuickStart{RoomId: rid}, func(data interface{}) {
					v := proto2.QuickStartResp{}
					ss.Unmarshal(data.([]byte), &v)
					if v.Code == proto2.ErrorCode_OK {
						state = proto2.GameState_INGAME
					}
				})
			case proto2.GameState_INGAME:
			}
		default:
		}
	}
}

var (
	args = flag.String("args", "1 1", "room robot.count")
)

// TestGame go test -v --run=TestGame --args="1 1"
func TestGame(t *testing.T) {
	// wait server startup
	flag.Parse()
	var (
		argList       = strings.Split(*args, " ")
		roomId        = argList[0]
		robotCount, _ = strconv.Atoi(argList[1])
	)
	wg := sync.WaitGroup{}
	for i := 0; i < robotCount; i++ {
		wg.Add(1)
		time.Sleep(50 * time.Millisecond)
		// 创建客户端
		go func(index int) {
			defer wg.Done()
			client(fmt.Sprintf("robot%d", index), roomId)
		}(i)
	}
	wg.Wait()
	t.Log("exit")
}

func TestWeb(t *testing.T) {
}
