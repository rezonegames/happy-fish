package models

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"happy-fish/pkg/z"
	"happy-fish/proto/proto"
)

type User struct {
	Name   string                   `bson:"name"`
	UserId string                   `bson:"_id"`
	Pic    string                   `bson:"pic"`
	Items  map[proto.ItemType]int32 `bson:"items"`
}

func (p *User) ConvToProto() *proto.UserInfo {
	var (
		itemList = make([]*proto.ItemInfo, 0)
	)

	for k, v := range p.Items {
		itemList = append(itemList, &proto.ItemInfo{
			Key: k,
			Val: v,
		})
	}
	return &proto.UserInfo{
		Name:     p.Name,
		ItemList: itemList,
		UserId:   p.UserId,
	}
}

func GetUser(userId string, fields ...string) (*User, error) {
	var (
		filter = bson.M{
			"_id": userId,
		}
		opts       = &options.FindOneOptions{}
		projection = bson.M{}
		p          = &User{}
		err        error
	)

	for _, field := range fields {
		projection[field] = 1
	}
	opts.Projection = projection

	err = mClient.FindOne(p, DB_NAME, COL_PLAYER, filter, opts)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, z.NilError{Msg: err.Error()}
		}
		return nil, err
	}
	return p, nil
}

func AddItems(userId string, itemList []*proto.ItemInfo) error {

	var (
		filter = bson.M{
			"_id": userId,
		}
		update = bson.D{}
	)

	for _, item := range itemList {
		key := fmt.Sprintf("items.%d", item.Key)
		update = append(update, bson.E{Key: "$inc", Value: bson.D{{key, item.Val}}})
	}
	return mClient.UpsertOne(DB_NAME, COL_PLAYER, filter, update)
}

func CreateUser(name string, pic string, coin int32) (*User, error) {
	var (
		err      error
		user     *User
		userId   string
		insertId any
	)

	userId, err = GetNextID(COL_PLAYER)
	if err != nil {
		return nil, err
	}

	user = &User{
		UserId: userId,
		Name:   name,
		Pic:    pic,
		Items:  make(map[proto.ItemType]int32, 0),
	}

	user.Items[proto.ItemType_COIN] = coin
	insertId, err = mClient.InsertOne(DB_NAME, COL_PLAYER, user)
	user.UserId = insertId.(string)
	return user, err
}
