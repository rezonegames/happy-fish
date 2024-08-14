import {_decorator, Label, Node, instantiate, v3} from "cc";
import {AccountLoginReq, AccountLoginResp} from "db://assets/game/script/proto/web";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {UIView} from "db://assets/core/ui/ui-view";

import {Game, UIID} from "db://assets/game/script/game";
import {uiManager} from "db://assets/core/ui/ui-manager";
import FishNet from "db://assets/game/script/fish-net";

const {ccclass, property} = _decorator;

@ccclass
export default class UILogin extends UIView {

    @property(Label) info!: Label
    @property(Node) connect!: Node
    @property(Label) adder!: Label;

    onOpen(fromUI: number, ...args) {
        super.onOpen(fromUI, ...args);
        // Game.log.logView("UILogin", "UILogin");
        this.clearConnect();
    }

    clearConnect() {
        this.connect.active = false;
        Game.channel.gameClose();
    }

    setConnect(resp: AccountLoginResp) {
        this.adder.string = resp.addr;
        let info;
        if (resp.userId == "") {
            info = "No Account, Connect to server and Register, Happy Go";
        } else {
            // 账号基本信息保存在本地
            Game.storage.setUser(resp.userId);
            info = `userId: ${resp.userId} name: ${resp.name}`;
        }
        this.info.string = info;
        this.connect.active = true
    }

    login(accountType: number, accountId: string, password: string, callback: any) {
        this.clearConnect();
        Game.http.post("/v1/login", AccountLoginReq.encode({
                partition: accountType,
                accountId: accountId,
                password: password,
            }).finish(), (response: any) => {
                let resp = AccountLoginResp.decode(response);
                Game.log.logNet(resp, "登录");
                if (resp.code == ErrorCode.OK) {
                    Game.storage.set("accountId", accountId);
                    this.setConnect(resp);
                } else {
                    callback(resp);
                }
            }
        );
    }

    onGuestLogin() {
        uiManager.open(UIID.UILogin_Guest, this);
    }

    onWeiXinLogin() {
        uiManager.open(UIID.UIToast, "waiting！！！！")
    }

    onFacebookLogin() {
    }

    onConnect() {
        Game.channel.gameClose();
        Game.channel.gameConnect(this.adder.string);
    }
}
