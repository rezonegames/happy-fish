import {_decorator, Label, Node, tween, Vec3, Sprite, EditBox} from "cc";
import {AccountLoginReq, AccountLoginResp} from "db://assets/game/script/proto/web";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {UIView} from "db://assets/core/ui/UIView";

import {Game, UIID} from "db://assets/game/script/Game";
import {uiManager} from "db://assets/core/ui/UIManager";

const {ccclass, property} = _decorator;

@ccclass
export default class UILogin extends UIView {

    @property(Label)
    private uri: Label

    @property(Node)
    private connect: Node

    private adder: string;

    onOpen(fromUI: number, ...args) {
        super.onOpen(fromUI, ...args);
        this.clearConnect();
    }

    clearConnect() {
        this.connect.active = false;
        Game.channel.gameClose();
    }

    setConnect(resp: AccountLoginResp) {
        this.adder = resp.addr;
        let name = resp.name;
        if (resp.userId == 0) {
            name = "无账号，登录游戏后注册";
        } else {
            // 账号基本信息保存在本地
            Game.storage.setUser(resp.userId);
        }
        this.uri.string = name;
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
    }

    onFacebookLogin() {
    }

    onConnect() {
        Game.channel.gameClose();
        Game.channel.gameConnect(this.adder);
    }
}
