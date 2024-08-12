package service

import (
	"github.com/lonng/nano/component"
	"github.com/lonng/nano/session"
	"happy-fish/config"
	"happy-fish/internal/game/util"
	"happy-fish/models"
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
)

type RoomService struct {
	*component.Base
	serviceName string
	rooms       map[string]util.RoomEntity
}

func NewRoomService() *RoomService {
	return &RoomService{
		rooms: make(map[string]util.RoomEntity, 0),
	}
}

func (r *RoomService) AfterInit() {
	// 处理玩家断开连接
	session.Lifetime.OnClosed(func(s *session.Session) {
		var (
			uid     = s.UID()
			rs, err = models.GetSession(uid)
		)
		log.Info("AfterInit before user: %s leave", uid)
		if err != nil {
			return
		}
		for roomId, v := range r.rooms {
			if rs.RoomId == roomId {
				err = v.Leave(s)
				if err != nil {
					log.Info("AfterInit user: %s leave err: %+v", uid, err)
				}
			}
		}
	})
}

func (r *RoomService) BeforeShutdown() {
	for _, room := range r.rooms {
		room.BeforeShutdown()
	}
}

func (r *RoomService) AddRoomEntity(roomId string, entity util.RoomEntity) {
	r.rooms[roomId] = entity
}

func (r *RoomService) Entity(roomId string) (util.RoomEntity, error) {
	var (
		room, ok = r.rooms[roomId]
	)
	if !ok {
		return nil, z.NilError{Msg: roomId}
	}
	return room, nil
}

func (r *RoomService) GetRoomFromSession(s *session.Session) (util.RoomEntity, error) {
	var (
		uid    = s.UID()
		rs     *models.Session
		roomId string
		err    error
	)
	rs, err = models.GetSession(uid)
	if err != nil {
		return nil, err
	}
	roomId = rs.RoomId
	return r.Entity(roomId)
}

func (r *RoomService) GetTableFromSession(s *session.Session) (util.TableEntity, error) {
	var (
		uid   = s.UID()
		rs    *models.Session
		err   error
		room  util.RoomEntity
		table util.TableEntity
	)
	rs, err = models.GetSession(uid)
	if err != nil {
		return nil, err
	}
	room, err = r.Entity(rs.RoomId)
	if err != nil {
		return nil, err
	}
	table, err = room.Entity(rs.TableId)
	if err != nil {
		return nil, err
	}
	return table, nil
}

func (r *RoomService) GetRoomList(s *session.Session, _ *proto.GetRoomList) error {
	var (
		roomList = make([]*proto.RoomInfo, 0)
	)
	for _, v := range config.RoomListConfig {
		var (
			roomId    = v.RoomId
			room, err = r.Entity(roomId)
		)
		if err != nil {
			continue
		}
		roomList = append(roomList, room.GetRoomInfo())
	}
	return s.Response(&proto.GetRoomListResp{
		Code:     proto.ErrorCode_OK,
		RoomList: roomList,
	})
}

func (r *RoomService) GetTableList(s *session.Session, msg *proto.GetTableList) error {
	var (
		roomId    = msg.RoomId
		room, err = r.Entity(roomId)
		from      = msg.From
		limit     = msg.Limit
		tableList []*proto.TableInfo
		code      = proto.ErrorCode_OK
	)
	if err != nil {
		code = proto.ErrorCode_RoomNotKnown
		goto EXIT
	}
	tableList = room.GetTableList(from, limit)
	return s.Response(&proto.GetTableListResp{
		Code:      code,
		TableList: tableList,
	})
EXIT:
	return s.Response(&proto.GetTableListResp{
		Code: code,
	})
}

func (r *RoomService) JoinRoom(s *session.Session, msg *proto.JoinRoom) error {
	var (
		roomId    = msg.RoomId
		room, err = r.Entity(roomId)
		oldRoom   util.RoomEntity
		code      = proto.ErrorCode_OK
	)
	if err != nil {
		code = proto.ErrorCode_RoomNotKnown
		goto EXIT
	}
	if oldRoom, err = r.GetRoomFromSession(s); err == nil {
		if err = oldRoom.Leave(s); err != nil {
			code = proto.ErrorCode_AlreadyInRoom
			goto EXIT
		}
	}
	if err = room.Join(s); err != nil {
		code = proto.ErrorCode_JoinError
		goto EXIT
	}
	return s.Response(&proto.JoinRoomResp{
		Code:     code,
		RoomInfo: room.GetRoomInfo(),
	})
EXIT:
	return s.Response(&proto.JoinRoomResp{
		Code: code,
	})
}

func (r *RoomService) LeaveRoom(s *session.Session, _ *proto.LeaveRoom) error {
	var (
		room util.RoomEntity
		err  error
		code = proto.ErrorCode_OK
	)
	room, err = r.GetRoomFromSession(s)
	if err != nil {
		goto EXIT
	}
	err = room.Leave(s)
	if err != nil {
		code = proto.ErrorCode_LeaveError
	}
EXIT:
	return s.Response(&proto.LeaveRoomResp{
		Code: code,
	})
}

func (r *RoomService) CreateTable(s *session.Session, msg *proto.CreateTable) error {
	var (
		tableId  = msg.TableId
		password = msg.Password
		err      error
		table    util.TableEntity
		room     util.RoomEntity
		code     = proto.ErrorCode_OK
	)
	room, err = r.GetRoomFromSession(s)
	if err != nil {
		code = proto.ErrorCode_NotJoinRoomError
		goto EXIT
	}

	table, err = room.CreateTable(s, tableId, password)
	if err != nil {
		code = proto.ErrorCode_CreateTableError
		goto EXIT
	}
	return s.Response(&proto.CreateTableResp{
		Code:  code,
		Table: table.GetTableInfo(),
	})
EXIT:
	return s.Response(&proto.CreateTableResp{
		Code: code,
	})
}

func (r *RoomService) KickUser(s *session.Session, msg *proto.KickUser) error {
	var (
		err      error
		table    util.TableEntity
		kickUser = msg.UserId
		code     = proto.ErrorCode_OK
	)
	table, err = r.GetTableFromSession(s)
	if err != nil {
		code = proto.ErrorCode_KickUserError
		goto EXIT
	}
	err = table.KickUser(s, kickUser)
	if err != nil {
		code = proto.ErrorCode_KickUserError
		goto EXIT
	}
	return s.Response(&proto.KickUserResp{
		Code: code,
	})
EXIT:
	return s.Response(&proto.KickUserResp{
		Code: code,
	})
}

func (r *RoomService) JoinTable(s *session.Session, msg *proto.JoinTable) error {
	var (
		err     error
		tableId = msg.TableId
		table   util.TableEntity
		room    util.RoomEntity
		code    = proto.ErrorCode_OK
	)
	room, err = r.GetRoomFromSession(s)
	if err != nil {
		code = proto.ErrorCode_NotJoinRoomError
		goto EXIT
	}
	table, err = room.Entity(tableId)
	if err != nil {
		code = proto.ErrorCode_TableNotKnown
		goto EXIT
	}
	err = table.Join(s)
	if err != nil {
		code = proto.ErrorCode_JoinTableError
		goto EXIT
	}
	return s.Response(&proto.JoinTableResp{
		Code: code,
	})
EXIT:
	return s.Response(&proto.JoinTableResp{
		Code:  code,
		Table: table.GetTableInfo(),
	})
}

func (r *RoomService) LeaveTable(s *session.Session, _ *proto.LeaveTable) error {
	var (
		table util.TableEntity
		err   error
		code  = proto.ErrorCode_OK
	)
	if table, err = r.GetTableFromSession(s); err != nil {
		// 解散等原因，直接返回成功
		goto EXIT
	}
	if err = table.Leave(s); err != nil {
		code = proto.ErrorCode_LeaveTableError
		goto EXIT
	}
EXIT:
	return s.Response(&proto.LeaveTableResp{
		Code: code,
	})
}

func (r *RoomService) SitDown(s *session.Session, msg *proto.SitDown) error {
	var (
		err      error
		password = msg.Password
		seatId   = msg.SeatId
		table    util.TableEntity
		code     = proto.ErrorCode_OK
	)
	if table, err = r.GetTableFromSession(s); err != nil {
		code = proto.ErrorCode_NotJoinTableError
		goto EXIT
	}
	err = table.SitDown(s, seatId, password)
	if err != nil {
		code = proto.ErrorCode_SitDownError
		goto EXIT
	}
EXIT:
	return s.Response(&proto.SitDownResp{
		Code: code,
	})
}

func (r *RoomService) StandUp(s *session.Session, _ *proto.StandUp) error {
	var (
		table util.TableEntity
		err   error
		code  = proto.ErrorCode_OK
	)
	if table, err = r.GetTableFromSession(s); err != nil {
		code = proto.ErrorCode_TableNotKnown
		goto EXIT
	}
	if err = table.StandUp(s); err != nil {
		code = proto.ErrorCode_StandUpErrpr
		goto EXIT
	}
EXIT:
	return s.Response(&proto.StandUpResp{
		Code: code,
	})
}

func (r *RoomService) QuickStart(s *session.Session, msg *proto.QuickStart) error {
	var (
		roomId    = msg.RoomId
		room, err = r.Entity(roomId)
		code      = proto.ErrorCode_OK
		oldRoom   util.RoomEntity
		table     util.TableEntity
	)
	if err != nil {
		code = proto.ErrorCode_RoomNotKnown
		goto EXIT
	}
	if oldRoom, err = r.GetRoomFromSession(s); err == nil {
		if err = oldRoom.Leave(s); err != nil {
			code = proto.ErrorCode_AlreadyInRoom
			goto EXIT
		}
	}
	table, err = room.QuickStart(s)
	if err != nil {
		code = proto.ErrorCode_QuickStartError
		goto EXIT
	}
	return s.Response(&proto.QuickStartResp{
		Code:      proto.ErrorCode_OK,
		TableInfo: table.GetTableInfo(),
	})
EXIT:
	return s.Response(&proto.QuickStartResp{Code: code})
}

// Ready notify不需要返回
func (r *RoomService) Ready(s *session.Session, _ *proto.NotifyReady) error {
	var (
		table util.TableEntity
		err   error
	)
	table, err = r.GetTableFromSession(s)
	if err != nil {
		return err
	}
	return table.Ready(s)
}

// UpdateFrame 同步操作数据，不需要返回
func (r *RoomService) UpdateFrame(s *session.Session, msg *proto.NotifyUpdateFrame) error {
	var (
		table util.TableEntity
		err   error
	)
	table, err = r.GetTableFromSession(s)
	if err != nil {
		return err
	}
	return table.NotifyUpdateFrame(s, msg)
}

// ResumeTable 断线重连，用来恢复游戏用的
func (r *RoomService) ResumeTable(s *session.Session, msg *proto.ResumeTable) error {
	var (
		table util.TableEntity
		err   error
		uid   = s.UID()
		code  = proto.ErrorCode_OK
	)
	table, err = r.GetTableFromSession(s)
	if err != nil {
		models.RemoveSession(uid)
		code = proto.ErrorCode_TableDismissError
		goto EXIT
	}
	err = table.ResumeTable(s)
	if err != nil {
		models.RemoveSession(uid)
		code = proto.ErrorCode_UnknownError
		goto EXIT
	}
	// 包括桌子信息与帧信息
	return s.Response(&proto.ResumeTableResp{
		Code: code,
	})
EXIT:
	return s.Response(&proto.ResumeTableResp{
		Code: code,
	})
}
