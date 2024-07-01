package room

import (
	"happy-fish/internal/game/util"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
	"sync"
	"time"
)

type Fish struct {
	fishId   string
	grounds  *FishGrounds
	fish1    *proto.FishInfo
	bezier1  *proto.BezierInfo
	life     int32
	timer    *time.Timer
	state    proto.NpcState
	bornTime int64
	lock     sync.Locker
}

func NewFish(fishId string, grounds *FishGrounds, fish1 *proto.FishInfo, bezier1 *proto.BezierInfo) *Fish {
	var (
		fish *Fish
	)

	fish = &Fish{
		fish1:    fish1,
		bezier1:  bezier1,
		grounds:  grounds,
		fishId:   fishId,
		state:    proto.NpcState_ALIVE,
		bornTime: z.NowUnixMilli(),
	}

	for _, v := range bezier1.BezierList {
		fish.life += v.Seconds
	}

	// 多少秒之后死亡
	fish.timer = time.AfterFunc(time.Duration(fish.life+1)*time.Second, fish.Die)

	//log.Debug(grounds.Format("fish %d born life %d seconds", fishId, fish.life))
	return fish
}

func (f *Fish) Die() {
	//log.Debug(f.grounds.Format("fish %d die", f.fishId))
	f.lock.Lock()
	defer f.lock.Unlock()

	if f.state == proto.NpcState_DIE {
		return
	}

	f.state = proto.NpcState_DIE
	f.timer.Stop()
	f.grounds.FishDie(f)
}

func (f *Fish) Hit(client util.ClientEntity) bool {
	if z.RandInt(0, 10) < 5 {
		f.Die()

		return true
	}
	return false
}

func (f *Fish) GetInfo() *proto.FishInfo {
	var (
		name = f.fish1.Name
		info *proto.FishInfo
	)

	info = &proto.FishInfo{
		FishId:   f.fishId,
		Name:     name,
		Bezier:   f.bezier1,
		BornTime: f.bornTime,
	}

	return info
}
