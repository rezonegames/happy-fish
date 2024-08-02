package config

import (
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
)

var (
	ServerConfig     *ServerInfo
	FishListConfig   []*proto.FishInfo
	RoomListConfig   []*proto.RoomInfo
	WeaponListConfig []*proto.WeaponInfo
	TweenListConfig  []*proto.TweenInfo
)

func InitConfig() {
	z.ReadYaml("server.yaml", &ServerConfig)
	z.ReadJson("fish.json", &FishListConfig)
	z.ReadJson("room.json", &RoomListConfig)
	z.ReadJson("tween.json", &TweenListConfig)
	z.ReadJson("weapon.json", &WeaponListConfig)
	log.Info("InitConfig all done :）")
}

// RandomFish 随机一条鱼
func RandomFish() *proto.FishInfo {
	return FishListConfig[z.RandInt(0, len(FishListConfig)-1)]
}

// RandomTween 随机返回一个动作
func RandomTween() *proto.TweenInfo {
	return TweenListConfig[z.RandInt(0, len(TweenListConfig)-1)]
}
