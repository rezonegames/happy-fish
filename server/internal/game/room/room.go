package room

import (
	"fmt"
	"github.com/lonng/nano"
	"github.com/lonng/nano/session"
	"happy-fish/internal/game/util"
	"happy-fish/models"
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
)

type Room struct {
	group    *nano.Group
	roomInfo *proto.RoomInfo
	tables   map[string]util.TableEntity
	roomId   string
	index    int
}

func (r *Room) QuickStart(s *session.Session) (util.TableEntity, error) {
	var (
		suitTable util.TableEntity
		tableInfo *proto.TableInfo
		err       error
	)
	for _, v := range r.tables {
		tableInfo = v.GetTableInfo()
		if len(tableInfo.Users) < 6 {
			suitTable = v
			break
		}
	}
	if suitTable == nil {
		suitTable, err = r.CreateTable(s, fmt.Sprintf("%s_%d", r.roomId, r.index), "")
		if err != nil {
			return nil, err
		}
		r.index += 1
	}
	// 加入房间
	err = r.Join(s)
	if err != nil {
		return nil, err
	}
	// 加入桌子
	err = suitTable.Join(s)
	if err != nil {
		return nil, err
	}
	// 坐下
	err = suitTable.SitDown(s, -1, "")
	if err != nil {
		return nil, err
	}
	// 准备开始
	return suitTable, suitTable.Ready(s)
}

func (r *Room) AfterInit() {
}

func (r *Room) BeforeShutdown() {
	for _, uid := range r.group.Members() {
		log.Info(r.Format("BeforeShutdown leave user %s", uid))
		models.RemoveSession(uid)
	}
}

func (r *Room) Format(format string, v ...interface{}) string {
	format = fmt.Sprintf("%s|", r.roomId) + " " + fmt.Sprintf(format, v...)
	return format
}

func (r *Room) tryLeaveTable(s *session.Session) error {
	var (
		uid     = s.UID()
		rs, err = models.GetSession(uid)
		table   util.TableEntity
	)
	if err == nil {
		table, err = r.Entity(rs.TableId)
		if err == nil {
			// 先站起来
			err = table.StandUp(s)
			if err != nil {
				return err
			}
			// 再离开房间
			err = table.Leave(s)
			if err != nil {
				return err
			}
			log.Info(r.Format("tryLeaveTable user: %s leave table: %s success", uid, rs.TableId))
		}
	}
	return nil
}

func (r *Room) Leave(s *session.Session) error {
	var (
		uid = s.UID()
		err = r.tryLeaveTable(s)
	)
	if err != nil {
		return err
	}
	models.RemoveSession(uid)
	return r.group.Leave(s)
}

func (r *Room) Join(s *session.Session) error {
	var (
		uid = s.UID()
		err error
	)
	err = models.SetRoomId(uid, r.roomId)
	if err != nil {
		return err
	}
	return r.group.Add(s)
}

func (r *Room) CreateTable(s *session.Session, tableId, password string) (util.TableEntity, error) {
	var (
		table util.TableEntity
	)
	table = NewTable(&util.TableOption{
		Room:          r,
		CustomTableId: tableId,
		Password:      password,
	})
	r.tables[tableId] = table
	return table, nil
}

func (r *Room) GetConfig() *proto.RoomInfo {
	return r.roomInfo
}

func (r *Room) OnTableDeleted(tableId string) {
	delete(r.tables, tableId)
}

func (r *Room) Entity(tableId string) (util.TableEntity, error) {
	var (
		table util.TableEntity
		ok    bool
	)
	table, ok = r.tables[tableId]
	if !ok {
		return nil, z.NilError{Msg: tableId}
	}
	return table, nil
}

func (r *Room) GetRoomInfo() *proto.RoomInfo {
	var (
		roomInfo = r.roomInfo
	)
	roomInfo.TableCount = int32(len(r.tables))
	return roomInfo
}

func (r *Room) GetTableList(from int32, limit int32) []*proto.TableInfo {
	var (
		tableList = make([]*proto.TableInfo, 0)
	)
	for _, v := range r.tables {
		tableList = append(tableList, v.GetTableInfo())
	}
	return tableList
}

func NewNormalRoom(opt *util.RoomOption) *Room {
	var (
		room1  = opt.Room1
		roomId = room1.RoomId
		room   *Room
	)
	room = &Room{
		roomId:   roomId,
		group:    nano.NewGroup(roomId),
		roomInfo: room1,
		tables:   make(map[string]util.TableEntity, 0),
	}
	return room
}
