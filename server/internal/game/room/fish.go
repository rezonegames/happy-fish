package room

import (
	"happy-fish/internal/game/util"
	"happy-fish/pkg/log"
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
		nPos             = z.RandInt32(4, 4)
		width      int32 = 1480
		height     int32 = 720
		i          int32
	)
	fish = &Fish{
		fishInfo: &proto.FishInfo{
			FishId:       fishId,
			Name:         fishInfo.Name,
			Coin:         fishInfo.Coin,
			Hp:           fishInfo.Coin,
			DodgeRate:    fishInfo.DodgeRate,
			DefenceValue: fishInfo.DefenceValue,
			ActionList:   nil,
		},
		grounds:  grounds,
		fishId:   fishId,
		state:    proto.NpcState_ALIVE,
		bornTime: z.NowUnixMilli(),
	}
	for i = 0; i < nPos; i++ {
		// 锚点在中间（0，0）
		var action = &proto.FishAction{
			X: -width/2 + i*(width/(nPos-1)),
			Y: -height/2 + z.RandInt32(0, height),
			//TweenInfo: config.RandomTween(),
			Seconds: z.RandInt32(4, 6),
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

// Hit todo：应该根据客户端的炮的威力来计算击中的概率，目前就按照5：5比例作为击中概率
func (f *Fish) Hit(client util.ClientEntity) bool {
	if z.RandInt(0, 10) < 8 {
		f.Die()
		log.Info("fish: %s was killed by user: %s", f.fishId, client.GetUserId())
		return true
	}
	return false
}

func (f *Fish) GetInfo() *proto.FishInfo {
	return f.fishInfo
}
