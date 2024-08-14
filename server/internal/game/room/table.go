package room

import (
	"fmt"
	"github.com/lonng/nano"
	"github.com/lonng/nano/session"
	"github.com/pkg/errors"
	"happy-fish/internal/game/util"
	"happy-fish/models"
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
	"sync"
)

// Table 桌子
type Table struct {
	group       *nano.Group
	tableId     string
	room1       *proto.RoomInfo
	clients     map[string]util.ClientEntity
	lock        sync.RWMutex
	waiter      util.WaiterEntity
	room        util.RoomEntity
	state       proto.TableState
	chState     chan proto.TableState
	chEnd       chan bool
	createTime  int64
	password    string
	fishGrounds *FishGrounds
}

func (t *Table) BroadCastTableAction(action *proto.OnTableAction) error {
	_ = t.group.Broadcast("onTableAction", action)
	return nil
}

func (t *Table) AfterInit() {
}

func (t *Table) GetTableId() string {
	return t.tableId
}

func (t *Table) Format(format string, v ...interface{}) string {
	var (
		tableId = t.tableId
	)
	format = fmt.Sprintf("%s|%v", tableId, t.state) + " " + fmt.Sprintf(format, v...)
	return format
}

func (t *Table) GetTableInfo() *proto.TableInfo {
	var (
		tableInfo *proto.TableInfo
		users     = make(map[string]*proto.UserInfo, 0)
		room1     = t.room1
	)
	for uid, client := range t.clients {
		users[uid] = client.GetUserInfo()
	}
	tableInfo = &proto.TableInfo{
		TableId:     t.tableId,
		TableState:  t.state,
		Users:       users,
		Waiter:      nil,
		Res:         nil,
		Room:        room1,
		HasPassword: t.password == "",
		CreateTime:  t.createTime,
		Owner:       "",
	}
	return tableInfo
}

func (t *Table) WaiterEntity() util.WaiterEntity {
	return t.waiter
}

func (t *Table) Entity(userId string) (util.ClientEntity, error) {
	var (
		client, ok = t.clients[userId]
	)
	if !ok {
		return nil, z.NilError{Msg: "client is nil"}
	}
	return client, nil
}

// ChangeState todo：捕鱼桌暂时没有其它的状态，目前不会调用
func (t *Table) ChangeState(state proto.TableState) {
	t.state = state
	var (
		err       error
		tableInfo = t.GetTableInfo()
	)
	err = t.group.Broadcast("onState", &proto.OnGameState{
		State:     proto.GameState_INGAME,
		TableInfo: tableInfo,
	})
	if err != nil {
		log.Error(t.Format("ChangeState err %+v", err))
	}
}

func (t *Table) Ready(s *session.Session) error {
	var (
		uid         = s.UID()
		client, err = t.Entity(uid)
	)
	if err != nil {
		return err
	}
	return client.Ready()
}

// NotifyUpdateFrame 玩家的行为，根据行为把结果下发
func (t *Table) NotifyUpdateFrame(s *session.Session, msg *proto.NotifyUpdateFrame) error {
	var (
		action      = msg.Action
		uid         = s.UID()
		client, err = t.Entity(uid)
	)
	if err != nil {
		log.Error(t.Format("NotifyUpdateFrame offline %d !!! why", uid))
		return err
	}
	switch action.Key {
	case proto.ActionType_Hit_Fish:
		var (
			fishIdList = action.ValList
			killList   = make([]string, 0)
		)
		for _, fishId := range fishIdList {
			if ok := t.fishGrounds.HitFish(fishId, client); ok {
				killList = append(killList, fishId)
			}
		}
		if len(killList) <= 0 {
			return nil
		}
		action = &proto.Action{
			ValList: killList,
			Key:     proto.ActionType_Kill_Fish,
		}
	// todo：直接将响应的操作返回给客户端，需要check金币够不够了
	case proto.ActionType_Shoot:
		fallthrough
	case proto.ActionType_Weapon_LevelUp:
	default:
		log.Error(t.Format("NotifyUpdateFrame user %d action unknown %s", uid, z.ToString(action)))
		return nil
	}
	return t.group.Broadcast("onFrame", &proto.OnFrame{
		UserId: uid,
		Action: action,
	})
}

func (t *Table) ResumeTable(s *session.Session) error {
	//TODO implement me
	panic("implement me")
}

func (t *Table) Leave(s *session.Session) error {
	var (
		uid = s.UID()
	)
	models.RemoveTableId(uid)
	return t.group.Leave(s)
}

func (t *Table) Join(s *session.Session) error {
	var (
		err     error
		uid     = s.UID()
		tableId = t.tableId
	)
	err = models.SetTableId(uid, tableId)
	if err != nil {
		return err
	}
	return t.group.Add(s)
}

func (t *Table) StandUp(s *session.Session) error {
	var (
		uid             = s.UID()
		standUpUser, ok = t.clients[uid]
	)
	delete(t.clients, uid)
	if ok {
		_ = t.BroadCastTableAction(&proto.OnTableAction{
			Action: proto.TableAction_LEAVE_USER,
			User:   standUpUser.GetUserInfo(),
		})
	}
	return nil
}

func (t *Table) SitDown(s *session.Session, seatId int32, password string) error {
	if password != t.password {
		return errors.New("password err")
	}
	if _, ok := t.clients[s.UID()]; ok {
		return errors.New("already sit in seat, please stand up and resit")
	}
	var (
		uid           = s.UID()
		myClient      util.ClientEntity
		seatClientMap = make(map[int32]bool, 0)
		err           error
	)
	for k, client := range t.clients {
		// 不知是什么原因，直接重置session，并拉回
		if k == uid {
			client.Reconnect(s)
			return nil
		}
		var (
			clientSeatId = client.GetSeatId()
		)
		if clientSeatId == seatId {
			return errors.New("seat already has user")
		}
		seatClientMap[clientSeatId] = true
	}
	// 找到第一个空的座位坐下
	if seatId == -1 {
		var i int32
		for i = 1; i <= 6; i++ {
			if !seatClientMap[i] {
				seatId = i
				break
			}
		}
	}
	if seatId <= 0 {
		return errors.New("seatId <=0 err!!")
	}
	myClient = NewClient(&util.ClientOption{
		S:      s,
		SeatId: seatId,
		Table:  t,
	})
	t.clients[uid] = myClient
	_ = t.BroadCastTableAction(&proto.OnTableAction{
		Action: proto.TableAction_ADD_USER,
		User:   myClient.GetUserInfo(),
	})
	log.Info(t.Format("SitDown success user: %s seatId: %d :<", uid, seatId))
	return err
}

func (t *Table) KickUser(s *session.Session, kickUser string) error {
	//TODO implement me
	panic("implement me")
}

func (t *Table) GetSeatClient(seatId int32) (util.ClientEntity, bool) {
	for _, client := range t.clients {
		if client.GetSeatId() == seatId {
			return client, true
		}
	}
	return nil, false
}

func (t *Table) IsEmpty() bool {
	return len(t.clients) <= 0
}

func NewNormalTable(opt *util.TableOption) *Table {
	var (
		room        = opt.Room
		room1       = room.GetConfig()
		tableId     = opt.CustomTableId
		now         = z.NowUnixMilli()
		fishGrounds *FishGrounds
	)

	table := &Table{
		group:      nano.NewGroup(tableId),
		tableId:    tableId,
		clients:    make(map[string]util.ClientEntity, 0),
		room1:      room1,
		room:       room,
		createTime: now,
		chState:    make(chan proto.TableState, 10),
		chEnd:      make(chan bool, 6),
		state:      proto.TableState_GAMING,
	}
	// 渔场初始化的工作
	fishGrounds = NewFishGrounds(table)
	fishGrounds.AfterInit()
	table.fishGrounds = fishGrounds
	return table
}
