package models

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"strconv"
)

type Counter struct {
	CollName string `bson:"_id"`
	Counter  int    `bson:"counter"`
}

func GetNextID(collName string) (string, error) {
	var (
		err    error
		result Counter
	)
	// 使用 findOneAndUpdate 来获取并增加计数器
	err = mClient.FindOneAndUpdate(
		DB_NAME,
		COL_COUNTER,
		bson.M{"_id": collName},
		bson.M{"$inc": bson.M{"counter": 1}},
		&result,
		options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After),
	)
	if err != nil {
		return "", err
	}
	return strconv.Itoa(result.Counter), nil
}
