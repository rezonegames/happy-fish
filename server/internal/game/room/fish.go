package room

import (
	"happy-fish/config"
	"happy-fish/internal/game/util"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
	"sync"
	"time"
)

type Fish struct {
	fishId   string
	grounds  *FishGrounds
	fishInfo *proto.FishInfo
	life     int32
	timer    *time.Timer
	state    proto.NpcState
	bornTime int64
	lock     sync.Mutex
}

func NewFish(fishId string, grounds *FishGrounds, fishInfo *proto.FishInfo) *Fish {
	var (
		fish       *Fish
		actionList       = make([]*proto.FishAction, 0)
		nPos             = z.RandInt(3, 5)
		width      int32 = 1200
		height     int32 = 760
		lastX      int32 = 0
		minX             = width / 3
		maxX             = width / 5
	)
	fish = &Fish{
		fishInfo: fishInfo,
		grounds:  grounds,
		fishId:   fishId,
		state:    proto.NpcState_ALIVE,
		bornTime: z.NowUnixMilli(),
	}
	for i := 0; i < nPos; i++ {
		// 锚点在中间（0，0）
		var action = &proto.FishAction{
			X:         -width/2 + lastX + z.RandInt32(minX, maxX),
			Y:         -height/2 + z.RandInt32(0, height),
			TweenInfo: config.RandomTween(),
			Seconds:   z.RandInt32(3, 5),
		}
		fish.life += action.Seconds
		actionList = append(actionList, action)
	}
	fish.fishInfo.ActionList = actionList
	fish.timer = time.AfterFunc(time.Duration(fish.life)*time.Second+100*time.Millisecond, fish.Die)
	return fish
}

func (f *Fish) Die() {
	f.lock.Lock()
	defer f.lock.Unlock()
	if f.state == proto.NpcState_DIE {
		return
	}
	f.state = proto.NpcState_DIE
	f.timer.Stop()
	f.grounds.FishDie(f)
}

// Hit 应该根据客户端的炮的威力来计算击中的概率
func (f *Fish) Hit(client util.ClientEntity) bool {
	if z.RandInt(0, 10) < 5 {
		f.Die()
		return true
	}
	return false
}

func (f *Fish) GetInfo() *proto.FishInfo {
	return f.fishInfo
}
