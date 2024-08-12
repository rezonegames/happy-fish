package service

import (
	"github.com/lonng/nano"
	"github.com/lonng/nano/component"
	"github.com/lonng/nano/session"
	"happy-fish/internal/game/util"
	"happy-fish/models"
	"happy-fish/pkg/log"
	"happy-fish/proto/proto"
)

type GateService struct {
	*component.Base
	group *nano.Group
}

func NewGateService() *GateService {
	return &GateService{group: nano.NewGroup("all-users")}
}

func (g *GateService) AfterInit() {
	// Fixed: 玩家WIFI切换到4G网络不断开, 重连时，将UID设置为illegalSessionUid
	session.Lifetime.OnClosed(func(s *session.Session) {
		if err := g.offline(s); err != nil {
			log.Error("user exit UID=%s, Error=%s", s.UID, err.Error())
		}
	})
}

func (g *GateService) offline(s *session.Session) error {
	return g.group.Leave(s)
}

func (g *GateService) online(s *session.Session, user *models.User) error {
	var (
		uid = user.UserId
	)
	if ps, err := g.group.Member(uid); err == nil {
		log.Info("close old connect %s", ps.UID())
		g.group.Leave(ps)
		ps.Close()
	}
	log.Info("user: %s on-line", uid)
	return util.BindUser(s, user)
}

func (g *GateService) Register(s *session.Session, msg *proto.RegisterGameReq) error {
	var (
		accountId = msg.AccountId
		user      *models.User
		err       error
		code      = proto.ErrorCode_OK
	)
	if accountId == "" {
		code = proto.ErrorCode_AccountIdError
		goto EXIT
	}
	user, err = models.CreateUser(msg.Name, "", 100)
	if err != nil {
		goto EXIT
	}
	err = models.BindAccount(msg.AccountId, user.UserId)
	if err != nil {
		goto EXIT
	}
	err = g.online(s, user)
	if err != nil {
		goto EXIT
	}
	return s.Response(&proto.RegisterGameResponse{
		Code: code,
		User: user.ConvToProto(),
	})

EXIT:
	return s.Response(&proto.RegisterGameResponse{
		Code: code,
	})
}

func (g *GateService) Login(s *session.Session, msg *proto.LoginToGame) error {
	var (
		uid             = msg.UserId
		roomId, tableId string
		rs              *models.Session
		err             error
		user            *models.User
	)
	user, err = models.GetUser(uid)
	if err != nil {
		return err
	}
	err = g.online(s, user)
	if err != nil {
		return err
	}
	// 返回所在的房间号和桌子号
	if rs, err = models.GetSession(uid); err == nil {
		roomId = rs.RoomId
		tableId = rs.TableId
	}
	return s.Response(&proto.LoginToGameResp{
		Code:    proto.ErrorCode_OK,
		RoomId:  roomId,
		TableId: tableId,
		User:    user.ConvToProto(),
	})
}
