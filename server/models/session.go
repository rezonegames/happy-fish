package models

import (
	"fmt"
	"happy-fish/pkg/z"
	"time"
)

type Session struct {
	RoomId  string
	TableId string
}

func SESSION_KEY(userId string) string {
	return fmt.Sprintf("session:%d", userId)
}

func GetSession(userId string) (*Session, error) {
	var (
		cmds map[string]string
		err  error
		rs   = &Session{}
	)
	cmds, err = rClient.HGetAll(SESSION_KEY(userId)).Result()
	if err != nil {
		return nil, err
	}
	for k, v := range cmds {
		if k == "room" {
			rs.RoomId = v
		}
		if k == "table" {
			rs.TableId = v
		}
	}
	if rs.RoomId == "" {
		return nil, z.NilError{
			Msg: fmt.Sprintf("%s player no session", userId),
		}
	}
	return rs, nil
}

func SetRoomId(userId string, roomId string) error {
	var (
		key = SESSION_KEY(userId)
		err error
	)

	err = rClient.HSet(key, "room", roomId).Err()
	if err != nil {
		return err
	}
	return rClient.Expire(key, 20*time.Minute).Err()
}

func SetTableId(userId string, tableId string) error {
	var (
		key    = SESSION_KEY(userId)
		err    error
		fields = make(map[string]interface{}, 0)
	)

	fields["table"] = tableId
	err = rClient.HMSet(key, fields).Err()
	if err != nil {
		return err
	}
	return rClient.Expire(key, 20*time.Minute).Err()
}

func RemoveTableId(userId string) {
	rClient.HDel(SESSION_KEY(userId), "table")
}

func RemoveSession(userId string) {
	rClient.Del(SESSION_KEY(userId))
}
