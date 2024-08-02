import {_decorator, Label, Node} from "cc";
import {UIView} from "db://assets/core/ui/ui-view";
import {
    GetRoomList,
    GetRoomListResp,
    JoinRoom,
    JoinRoomResp,
    QuickStart, QuickStartResp,
    RoomInfo
} from "db://assets/game/script/proto/client";
import {Game, UIID} from "db://assets/game/script/game";
import {CallbackObject} from "db://assets/core/network/net-interface";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {uiManager} from "db://assets/core/ui/ui-manager";
import {SuperLayout} from "db://assets/core/components/super-layout";
import HallRoom from "db://assets/game/script/hall-room";

const {ccclass, property} = _decorator;

@ccclass
export default class UIHall extends UIView {

    @property(SuperLayout) layout!:SuperLayout;
    protected roomList: any[] = [];
    intervalTimer

    public onOpen(fromUI: number, ...args: any): void {
        super.onOpen(fromUI, ...args);
        // 刷新房间列表
        this.getRoomList();
        this.intervalTimer = setInterval(() => {
            this.getRoomList();
        }, 60000);
    }

    onClose(): any {
        super.onClose();
        clearInterval(this.intervalTimer);
    }

    onRefreshEvent(item: Node, index: number) {
        item.getComponent(HallRoom)?.show(this.roomList[index], index, this.onClickItem.bind(this))
    }

    onClickItem(index: number) {
    }

    getRoomList() {
        if (!uiManager.isTopUI(UIID.UIHall)) {
            return;
        }
        Game.channel.gameRequest("r.getroomlist", GetRoomList.encode({}).finish(), {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = GetRoomListResp.decode(data.body);
                if (resp.code == ErrorCode.OK) {
                    this.roomList = resp.roomList;
                    this.layout.total(this.roomList.length);
                }
            }
        });
    }
}
