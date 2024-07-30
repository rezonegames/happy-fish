package models

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
)

type Account struct {
	Partition int32  `bson:"partition"`
	AccountId string `bson:"_id"`
	UserId    string `bson:"user_id"`
	Password  string `bson:"password"`
}

func GetAccount(accountId string) (*Account, error) {
	var (
		err    error
		filter = bson.M{
			"_id": accountId,
		}
		opts = &options.FindOneOptions{}
		a    = &Account{}
	)

	err = mClient.FindOne(a, DB_NAME, COL_ACCOUNT, filter, opts)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, z.NilError{Msg: accountId}
		}
		return nil, err
	}
	return a, nil
}

func NewAccount(partition int32, accountId string, password string) *Account {
	return &Account{
		Partition: partition,
		AccountId: accountId,
		Password:  password,
	}
}

func BindAccount(accountId string, userId string) error {
	var (
		err    error
		filter = bson.M{
			"_id": accountId,
		}
		update = bson.M{
			"$set": bson.M{
				"user_id":    userId,
				"updated_at": z.NowUnixMilli(),
			},
		}
	)
	err = mClient.UpsertOne(DB_NAME, COL_ACCOUNT, filter, update)
	return err
}

func CreateAccount(a *Account) error {
	var (
		err      error
		insertId any
	)
	insertId, err = mClient.InsertOne(DB_NAME, COL_ACCOUNT, a)
	if err != nil {
		return err
	}
	log.Info("CreateAccount success: %s", insertId)
	return nil
}
