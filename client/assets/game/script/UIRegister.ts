import {_decorator, Label, EditBox} from "cc";
import {UIView} from "db://assets/core/ui/UIView";
import {uiManager} from "db://assets/core/ui/UIManager";
import {Game, UIID} from "db://assets/game/script/Game"
import {RegisterGameReq, RegisterGameResponse} from "db://assets/game/script/proto/client"
import {ErrorCode} from "db://assets/game/script/proto/error"

const {ccclass, property} = _decorator;

@ccclass
export default class UIRegister extends UIView {

    @property(Label)
    myAccount: Label;

    @property(EditBox)
    myName: EditBox;

    public onOpen(fromUI: number, ...args: any): void {
        super.onOpen(fromUI, ...args);
        let accountId = Game.storage.get("accountId");
        Game.log.logView(accountId, "accountId");
        this.myAccount.string = accountId;
    }

    onRegister() {
        Game.channel.gameRequest("g.register", RegisterGameReq.encode({
            name: this.myName.string,
            accountId: this.myAccount.string
        }).finish(), {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = RegisterGameResponse.decode(data.body);
                Game.log.logNet(resp, "注册游戏账号");
                if (resp.code == ErrorCode.OK) {

                    let user = resp.user;

                    if (!!user) {

                        Game.storage.setUser(user.userId);
                        Game.event.raiseEvent("onUserInfo", user);
                        uiManager.replace(UIID.UIHall);
                        return;
                    }

                    // todo：提示失败

                }
            }
        });
    }

}
