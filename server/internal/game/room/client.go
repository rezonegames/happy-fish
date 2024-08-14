package room

import (
	"github.com/lonng/nano/session"
	"happy-fish/config"
	"happy-fish/internal/game/util"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
)

type Client struct {
	user        *proto.UserInfo
	s           *session.Session
	resProgress int32
	joinTime    int64
	coin        int64 // todo：为带入金币，
	hitRate     int32
	weapon      *proto.WeaponInfo
}

func (n *Client) SetWeapon(weaponId string) {
	for _, v := range config.WeaponListConfig {
		if v.WeaponId == weaponId {
			n.weapon = v
			break
		}
	}
}

func (n *Client) GetWeapon() *proto.WeaponInfo {
	return n.weapon
}

func (n *Client) Ready() error {
	//TODO implement me
	//panic("implement me")
	return nil
}

func (n *Client) GetUserInfo() *proto.UserInfo {
	return n.user
}

func (n *Client) GetSession() *session.Session {
	return n.s
}

func (n *Client) Reconnect(s *session.Session) {
	n.s = s
	n.resProgress = 0
}

func (n *Client) GetUserId() string {
	return n.user.UserId
}

func (n *Client) GetSeatId() int32 {
	return n.user.SeatId
}

func (n *Client) SetSeatId(seatId int32) {
	n.user.SeatId = seatId
}

func (n *Client) AfterInit() {
}

func (n *Client) GetJoinTime() int64 {
	return n.joinTime
}

func NewNormalClient(opt *util.ClientOption) *Client {
	var (
		s       = opt.S
		seatId  = opt.SeatId
		user, _ = util.GetPlayer(s)
		now     = z.NowUnixMilli()
		client  *Client
	)
	client = &Client{
		user: &proto.UserInfo{
			Name:      user.Name,
			UserId:    user.UserId,
			UpdatedAt: 0,
			SeatId:    seatId,
		},
		s:        s,
		joinTime: now,
		weapon:   config.WeaponListConfig[0], // 默认第一把武器
	}
	return client
}
