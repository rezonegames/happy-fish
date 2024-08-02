import {_decorator, Label, Node, Animation, Vec3, Sprite, EditBox} from "cc";

import {UIView} from "db://assets/core/ui/ui-view";
import {AccountType} from "db://assets/game/script/proto/consts";
import {uiManager} from "db://assets/core/ui/ui-manager";
import {AccountLoginResp} from "db://assets/game/script/proto/web";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {UIID} from "db://assets/game/script/game";

const {ccclass, property} = _decorator;

@ccclass
export default class UIToast extends UIView {

    @property(Animation) anim!: Animation;
    @property(Label) msg!: Label;

    onOpen(fromUI: number, ...args) {
        super.onOpen(fromUI, ...args);
        let msg = args[0];
        this.msg.string = msg;
        let animName = "toast";
        this.anim.getState(animName).on("stop", (event)=>{
            uiManager.close(this);
        });
        this.anim.play(animName);
    }
}
