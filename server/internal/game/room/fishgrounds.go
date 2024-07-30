package room

import (
	"happy-fish/config"
	"happy-fish/internal/game/util"
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
	"strconv"
	"sync"
	"time"
)

// FishGrounds 渔场
type FishGrounds struct {
	width   int32 // w,h暂时不用
	height  int32
	index   int
	fishes  map[string]*Fish
	chEnd   chan bool
	maxFish int
	table   util.TableEntity
	mu      sync.Mutex
}

func NewFishGrounds(table util.TableEntity) *FishGrounds {
	var (
		fishGrounds *FishGrounds
	)
	fishGrounds = &FishGrounds{
		width:   1280,
		height:  720,
		index:   0,
		fishes:  make(map[string]*Fish, 0),
		chEnd:   make(chan bool, 6),
		maxFish: 10,
		table:   table,
	}
	return fishGrounds
}

func (f *FishGrounds) AfterInit() {
	var (
		ticker = time.NewTicker(time.Second)
	)

	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			if len(f.fishes) < f.maxFish {
				var (
					err           error
					randBornCount = z.RandInt(3, 5)
					fishList      = make([]*proto.FishInfo, 0)
				)
				for i := 0; i < randBornCount; i++ {
					var (
						fish *Fish
					)
					fish = f.BornFish()
					fishList = append(fishList, fish.GetInfo())
				}
				// 生成鱼，则下发状态
				err = f.table.BroadCastTableAction(&proto.OnTableAction{
					Action:   proto.TableAction_BORN_FISH,
					FishList: fishList,
				})
				if err != nil {
					log.Info(f.table.Format("born fish broadcast err: %+v", err))
				}
			}
		case <-f.chEnd:
			for _, fish := range f.fishes {
				fish.Die()
			}
			f.fishes = make(map[string]*Fish, 0)
			return
		}

	}

}

func (f *FishGrounds) Format(format string, v ...interface{}) string {
	return f.table.Format(format, v...)
}

func (f *FishGrounds) BornFish() *Fish {
	var (
		fish     *Fish
		fishId   string
		fishInfo = config.RandomFish()
	)
	f.mu.Lock()
	defer f.mu.Unlock()
	fishId = strconv.Itoa(f.index)
	fish = NewFish(fishId, f, fishInfo)
	f.fishes[fishId] = fish
	f.index += 1
	return fish
}

func (f *FishGrounds) GetInfo() {

}

func (f *FishGrounds) FishDie(fish *Fish) {
	f.mu.Lock()
	defer f.mu.Unlock()
	delete(f.fishes, fish.fishId)
}

func (f *FishGrounds) HitFish(fishId string, client util.ClientEntity) bool {
	var (
		fish, ok = f.fishes[fishId]
	)
	if !ok {
		return false
	}
	return fish.Hit(client)
}
