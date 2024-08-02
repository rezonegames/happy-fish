import {_decorator, Label, Node, tween, Vec3, Sprite, EditBox} from "cc";

import {UIView} from "db://assets/core/ui/ui-view";
import {AccountType} from "db://assets/game/script/proto/consts";
import {uiManager} from "db://assets/core/ui/ui-manager";
import {AccountLoginResp} from "db://assets/game/script/proto/web";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {UIID} from "db://assets/game/script/game";

const {ccclass, property} = _decorator;

@ccclass
export default class UILogin_Guest extends UIView {

    @property(EditBox) accountId: EditBox
    @property(EditBox) password: EditBox
    parent

    onOpen(fromUI: number, ...args) {
        super.onOpen(fromUI, ...args);
        this.parent = args[0];
    }

    onOK() {
        this.parent.login(AccountType.DEVICEID, this.accountId.string, this.password.string, function (resp: AccountLoginResp) {
            switch (resp.code) {
                case ErrorCode.PasswordError: // 密码错误
                    uiManager.open(UIID.UIToast, "password is wrong!!!");
                    break;
                default:
                    uiManager.open(UIID.UIToast, "unknown error!!!");
            }
        });
        uiManager.close();
    }

    onCancel() {
        uiManager.close();
    }
}
