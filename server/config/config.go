package config

import (
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
)

var (
	ServerConfig     = &ServerInfo{}
	FishListConfig   []*proto.FishInfo
	RoomListConfig   []*proto.RoomInfo
	BezierListConfig []*proto.BezierInfo
	WeaponListConfig []*proto.WeaponInfo
)

func InitConfig() {
	z.ReadYaml("server.yaml", ServerConfig)
	z.ReadJson("fish.json", &FishListConfig)
	z.ReadJson("room.json", &RoomListConfig)
	z.ReadJson("bezier.json", &BezierListConfig)
	log.Info("InitConfig all done :）")
}

// RandomFish 随机一条鱼
func RandomFish() *proto.FishInfo {
	return FishListConfig[z.RandInt(0, len(FishListConfig)-1)]
}

// RandomBezier 随机一条bezier曲线
func RandomBezier() *proto.BezierInfo {
	return BezierListConfig[z.RandInt(0, len(BezierListConfig)-1)]
}
