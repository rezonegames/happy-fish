package web

import (
	"bytes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"happy-fish/config"
	"happy-fish/internal/web/api"
	"happy-fish/pkg/log"
	"net/http"
	_ "net/http/pprof" //  初始化pprof
	"os"
	"os/signal"
	"syscall"
	"time"
)

type responseBodyWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (r responseBodyWriter) Write(b []byte) (int, error) {
	r.body.Write(b)
	return r.ResponseWriter.Write(b)
}

// Logger todo：protobuf的logger如何处理
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			t       = time.Now()
			url     = c.Request.URL.Path
			latency = time.Since(t)
		)
		c.Next()
		var (
			param, _ = c.Get("body")
			resp, _  = c.Get("resp")
		)
		log.Info("url: %s latency: %+v body: %+v resp: %+v", url, latency, param, resp)
	}
}

func Register(r *gin.Engine) {
	r.POST("/v1/login", api.LoginHandler)
	r.POST("/v1/register", api.RegisterHandler)

	r.GET("/debug/pprof/", func(c *gin.Context) {
		http.Redirect(c.Writer, c.Request, "/debug/pprof/", http.StatusSeeOther)
	})
}

func StartUp() {
	var (
		sc  = config.ServerConfig
		r   = gin.New()
		srv *http.Server
		err error
		sg  = make(chan os.Signal)
	)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true,
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"x-checksum"},
	}))
	r.Use(Logger())
	Register(r)
	srv = &http.Server{
		Addr:    sc.ServerPort,
		Handler: r,
	}
	go func() {
		err = srv.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			return
		}
	}()
	// pprof
	go func() {
		if err = http.ListenAndServe(":6060", nil); err != nil {
			log.Info("pprof server error: %v\n", err)
		}
	}()
	signal.Notify(sg, syscall.SIGINT, syscall.SIGQUIT, syscall.SIGKILL)
	// stop server
	select {
	case s := <-sg:
		log.Info("got signal: %s", s.String())
	}
}
