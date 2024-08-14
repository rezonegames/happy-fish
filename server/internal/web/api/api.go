package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"happy-fish/config"
	"happy-fish/models"
	"happy-fish/pkg/log"
	"happy-fish/pkg/z"
	"happy-fish/pkg/zweb"
	"happy-fish/proto/proto"
)

func GetGateAddr() (string, error) {
	var (
		sc = config.ServerConfig
	)

	// 内网还是外网ip
	if sc.IsDebug {
		//return z.GetPrivateIp()
		return "127.0.0.1", nil

	}

	return z.GetIp()

}

// LoginHandler 登录，如果玩家没有注册，自动注册之，只实现一种deviceId登录， todo：host暂时写死
func LoginHandler(c *gin.Context) {
	var (
		req  proto.AccountLoginReq
		err  error
		code = proto.ErrorCode_OK
	)
	err = zweb.BindProto(c, &req)
	if err != nil {
		goto EXIT
	}
	{
		var (
			partition = req.Partition
			accountId = req.AccountId
			userId    string
			name      string
			ip        string
			user      *models.User
			account   *models.Account
			password  = req.Password
			sc        = config.ServerConfig
		)
		if accountId == "" {
			code = proto.ErrorCode_AccountIdError
			goto EXIT
		}
		switch partition {
		case proto.AccountType_DEVICEID:
			account, err = models.GetAccount(accountId)
			if err != nil {
				if _, ok := err.(z.NilError); ok {

					account = models.NewAccount(int32(partition), accountId, password)
					err = models.CreateAccount(account)
					if err != nil {
						code = proto.ErrorCode_UnknownError
						goto EXIT
					}
				} else {
					code = proto.ErrorCode_UnknownError
					goto EXIT
				}
			}
			if account.Password != password {
				code = proto.ErrorCode_PasswordError
				goto EXIT
			}
		case proto.AccountType_FB:
			fallthrough
		case proto.AccountType_WX:
			code = proto.ErrorCode_UnSupportFunc
			goto EXIT

		default:
			log.Error("queryHandler no account %d %s", partition, accountId)
			goto EXIT
		}
		userId = account.UserId
		if userId != "" {
			user, err = models.GetUser(userId, "name")
			if err == nil {
				name = user.Name
			}
		}
		// 内网还是外网ip
		ip, err = GetGateAddr()
		if err != nil {
			goto EXIT
		}
		zweb.Response(c, &proto.AccountLoginResp{
			Code:   code,
			UserId: userId,
			Addr:   fmt.Sprintf("%s%s", ip, sc.Addr),
			Name:   name,
		})
		return
	}
EXIT:
	zweb.Response(c, &proto.AccountLoginResp{
		Code: code,
	})
}

func RegisterHandler(c *gin.Context) {

	var (
		req  proto.AccountRegisterReq
		err  error
		code = proto.ErrorCode_OK
	)
	err = zweb.BindProto(c, &req)
	if err != nil {
		goto EXIT
	}
	{
		var (
			accountId = req.AccountId
			sc        = config.ServerConfig
			ip        string
			account   *models.Account
			password  = req.Password
			partition = proto.AccountType_DEVICEID
		)
		if accountId == "" {
			code = proto.ErrorCode_AccountIdError
			goto EXIT
		}
		if password == "" {
			code = proto.ErrorCode_PasswordError
			goto EXIT
		}
		account, err = models.GetAccount(accountId)
		if err == nil {
			code = proto.ErrorCode_AlreadyRegister
			goto EXIT
		}
		// 内网还是外网ip
		ip, err = GetGateAddr()
		if err != nil {
			goto EXIT
		}
		account = models.NewAccount(int32(partition), accountId, password)
		err = models.CreateAccount(account)
		if err != nil {
			code = proto.ErrorCode_UnknownError
			goto EXIT
		}
		zweb.Response(c, &proto.AccountRegisterResp{
			Code: code,
			Addr: fmt.Sprintf("%s%s", ip, sc.Addr),
		})
		return
	}

EXIT:
	zweb.Response(c, &proto.AccountRegisterResp{
		Code: code,
	})
}
