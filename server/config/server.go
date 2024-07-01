package config

type ServerInfo struct {
	AppName         string        `yaml:"appName"`
	IsDebug         bool          `yaml:"isDebug"`
	TokenExpireTime int64         `yaml:"tokenExpireTime"`
	AppSecret       string        `yaml:"appSecret"`
	TokenSecret     string        `yaml:"tokenSecret"`
	Addr            string        `yaml:"addr"`
	ServerPort      string        `yaml:"serverPort"`
	EnableChecksum  bool          `yaml:"enableChecksum"`
	Redis           *RedisConfig  `yaml:"redis"`
	Mongo           *MongoConfig  `yaml:"mongo"`
	GmIps           []interface{} `yaml:"gmIps"`
	Version         string        `yaml:"version"`
}

type RedisConfig struct {
	Host string `yaml:"host"`
	Db   int    `yaml:"db"`
}

type MongoConfig struct {
	Uri string `yaml:"uri"`
	Db  string `yaml:"db"`
}
