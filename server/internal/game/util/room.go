package util

import (
	"github.com/lonng/nano/session"
	"happy-fish/proto/proto"
)

type RoomOption struct {
	Room1 *proto.RoomInfo
}
type RoomEntity interface {
	AfterInit()
	BeforeShutdown()
	Format(format string, v ...interface{}) string
	Leave(s *session.Session) error
	Join(s *session.Session) error
	CreateTable(s *session.Session, tableId, password string) (TableEntity, error)
	GetConfig() *proto.RoomInfo
	OnTableDeleted(tableId string)
	Entity(tableId string) (TableEntity, error)
	GetRoomInfo() *proto.RoomInfo
	GetTableList(from int32, limit int32) []*proto.TableInfo
	QuickStart(s *session.Session) (TableEntity, error)
}

type TableOption struct {
	Room          RoomEntity
	CustomTableId string
	Password      string
}
type TableEntity interface {
	AfterInit()
	GetTableId() string
	Format(format string, v ...interface{}) string
	GetTableInfo() *proto.TableInfo
	WaiterEntity() WaiterEntity
	Entity(userId string) (ClientEntity, error)
	ChangeState(state proto.TableState)
	Ready(s *session.Session) error
	NotifyUpdateFrame(s *session.Session, msg *proto.NotifyUpdateFrame) error
	ResumeTable(s *session.Session) error
	Leave(s *session.Session) error
	Join(s *session.Session) error
	StandUp(s *session.Session) error
	SitDown(s *session.Session, seatId int32, password string) error
	KickUser(s *session.Session, kickUser string) error
	GetSeatClient(seatId int32) (ClientEntity, bool)
	BroadCastTableAction(action *proto.OnTableAction) error
	IsEmpty() bool
}

type WaiterOption struct {
	SessionList []*session.Session
	Room        RoomEntity
	Table       TableEntity
}
type WaiterEntity interface {
	Ready(s *session.Session) error
	CancelReady(s *session.Session)
	Leave(s *session.Session) error
	CheckAndDismiss()
	GetInfo() *proto.TableInfo_Waiter
	AfterInit()
	ResetWaiter()
}

type ClientOption struct {
	S      *session.Session
	SeatId int32
	Table  TableEntity
}
type ClientEntity interface {
	GetUserInfo() *proto.UserInfo
	GetSession() *session.Session
	Reconnect(s *session.Session)
	GetUserId() string
	GetSeatId() int32
	SetSeatId(seatId int32)
	AfterInit()
	GetJoinTime() int64
	Ready() error
	SetWeapon(weaponId string)
	GetWeapon() *proto.WeaponInfo
}
