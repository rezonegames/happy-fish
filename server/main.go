package main

import (
	"github.com/urfave/cli"
	"golang.org/x/net/context"
	"happy-fish/config"
	"happy-fish/internal/game"
	"happy-fish/internal/web"
	"happy-fish/models"
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	random "math/rand"
	"os"
	"sync"
)

func main() {
	app := cli.NewApp()
	app.Name = "tetris"
	app.Author = "rezone games"
	app.Version = "0.0.1"
	app.Usage = "tetris"
	app.Action = serve
	app.Run(os.Args)
}

func serve(ctx *cli.Context) error {
	random.Seed(z.NowUnixMilli())
	ctx1 := context.Background()
	log.InitLog()
	config.InitConfig()
	sc := config.ServerConfig
	models.StartMongo(ctx1, sc.Mongo.Uri, sc.Mongo.Db, false)
	models.StartRedis(ctx1, sc.Redis.Host, sc.Redis.Db, "")
	wg := sync.WaitGroup{}
	wg.Add(2)
	go func() { defer wg.Done(); web.StartUp() }()  // 开启web服务器
	go func() { defer wg.Done(); game.StartUp() }() // 开启游戏服
	wg.Wait()
	return nil
}
