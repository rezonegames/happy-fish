package config

import (
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
)

var (
	ServerConfig      *ServerInfo
	FishListConfig    []*proto.FishInfo
	RoomListConfig    []*proto.RoomInfo
	WeaponListConfig  []*proto.WeaponInfo
	TweenListConfig   []*proto.TweenInfo
	weights           = []int{11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1}
	cumulativeWeights = make([]int, len(weights))
)

func InitConfig() {
	z.ReadYaml("server.yaml", &ServerConfig)
	z.ReadJson("fish.json", &FishListConfig)
	z.ReadJson("room.json", &RoomListConfig)
	z.ReadJson("tween.json", &TweenListConfig)
	z.ReadJson("weapon.json", &WeaponListConfig)

	weights = []int{11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1}
	cumulativeWeights = make([]int, len(weights))
	cumulativeWeights[0] = weights[0]
	for i := 1; i < len(weights); i++ {
		cumulativeWeights[i] = cumulativeWeights[i-1] + weights[i]
	}

	log.Info("InitConfig all done :）")
}

// RandomFish 随机一条鱼
func RandomFish() *proto.FishInfo {
	var (
		randomWeight = z.RandInt(0, cumulativeWeights[len(cumulativeWeights)-1])
		fishIndex    = 0
	)
	for i, weight := range cumulativeWeights {
		if randomWeight <= weight {
			fishIndex = i
			break
		}
	}
	return FishListConfig[fishIndex]
}

// RandomTween 随vi机返回一个动作
func RandomTween() *proto.TweenInfo {
	return TweenListConfig[z.RandInt(0, len(TweenListConfig)-1)]
}
