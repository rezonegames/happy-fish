package room

import (
	"fmt"
	"happy-fish/internal/game/util"
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
)

// NewClient 客户端类型，有可能是机器人，真人，以及结束方式可能不同，现在只有一种真人
func NewClient(opt *util.ClientOption) util.ClientEntity {
	var client util.ClientEntity
	client = NewNormalClient(opt)
	client.AfterInit()
	return client
}

// NewTable 根据桌子类型创建道具桌还是正常桌
func NewTable(opt *util.TableOption) util.TableEntity {
	var (
		roomInfo = opt.Room.GetConfig()
		table    util.TableEntity
		roomType = roomInfo.Type
	)
	switch roomType {
	case proto.RoomType_NORMAL:
		table = NewNormalTable(opt)
	default:
		panic(fmt.Sprintf("NewTable unknown type %s", roomType))
	}
	table.AfterInit()
	log.Info(table.Format("NewTable start %d", roomType))
	return table
}

// NewRoom 根据房间类型创建房间
func NewRoom(opt *util.RoomOption) util.RoomEntity {
	var (
		room1 = opt.Room1
		room  util.RoomEntity
	)
	switch room1.Type {
	case proto.RoomType_NORMAL:
		room = NewNormalRoom(opt)
	default:
		panic(fmt.Sprintf("NewRoom unknown type %s", room1.Type))
	}
	log.Info(room.Format("NewRoom %s", z.ToString(room1)))
	room.AfterInit()
	return room
}
