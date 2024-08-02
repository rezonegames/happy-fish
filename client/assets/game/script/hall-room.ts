import {_decorator, Label, Component, EditBox} from "cc";
import {QuickStart, QuickStartResp, RoomInfo} from "db://assets/game/script/proto/client";
import {CallbackObject} from "db://assets/core/network/net-interface";
import {Game, UIID} from "db://assets/game/script/game";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {uiManager} from "db://assets/core/ui/ui-manager";

const {ccclass, property} = _decorator;

@ccclass
export default class HallRoom extends Component {
    @property(Label) roomName!: Label
    @property(Label) roomUserCount!: Label
    @property(Label) detail!: Label
    private index!: number
    private roomInfo!: RoomInfo
    private clickFunc!: Function

    get transform() {
        return this.node._uiProps.uiTransformComp
    }

    show(data: any, index: number, callback: Function) {
        this.index = index;
        this.roomInfo = data;
        this.clickFunc = callback;
        this.roomName.string = `name: ${this.roomInfo.name}`;
        this.roomUserCount.string = `table count: ${this.roomInfo.tableCount} user count: ${this.roomInfo.userCount.toString()}`;
        this.detail.string = `detail: base coin: ${this.roomInfo.minCoin}`;
    }

    onClick() {
        this.clickFunc?.call(this, this.index)
    }

    onQuickStart() {
        Game.channel.gameRequest("r.quickstart", QuickStart.encode({roomId: this.roomInfo.roomId}).finish(), {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = QuickStartResp.decode(data.body);
                Game.log.logNet(resp, "快速开始");
                if (resp.code == ErrorCode.OK) {
                    // 准备进入渔场
                    uiManager.replace(UIID.UIFishGround, resp.tableInfo);
                } else {
                    // todo：进入失败，原因可能是带入金币不够
                    uiManager.open(UIID.UIToast, `Quick Start Err Code: ${resp.code}`);
                }
            }
        });
    }

    onInput() {

    }
}