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

const {ccclass, property} = _decorator;

@ccclass
export default class UIHall extends UIView {

    @property(ListView)
    private listView: ListView

    intervalTimer

    public onOpen(fromUI: number, ...args: any): void {
        super.onOpen(fromUI, ...args);
        setTimeout(() => {
            this.getRoomList();
        }, 100);
        // 房间列表每5秒刷新一次
        this.intervalTimer = setInterval(() => {
            this.getRoomList();
        }, 5000);
    }

    onClose(): any {
        super.onClose();
        clearInterval(this.intervalTimer);
    }

    refreshHallList(roomList: RoomInfo[]) {
        this.listView.setDelegate({
            items: () => roomList,
            reuse: (itemNode: Node, item: RoomInfo) => {
                itemNode.getChildByName("name").getComponent(Label).string = `房间：${item.roomId}`;
                itemNode.getChildByName("desc").getComponent(Label).string = `信息：${item.name}`;
                itemNode.getChildByName("count").getComponent(Label).string = `人数：${item.userCount}`;

                // 快速开始
                let quickStart = itemNode.getChildByName("quickstart");
                quickStart.off("click");
                quickStart.on("click", () => {
                    let buf = QuickStart.encode({roomId: item.roomId}).finish()
                    let rspObject: CallbackObject = {
                        target: this,
                        callback: (cmd: number, data: any) => {
                            let resp = QuickStartResp.decode(data.body);
                            Game.log.logNet(resp, "快速开始");
                            if (resp.code == ErrorCode.OK) {

                                // todo：进入渔场

                            }
                        }
                    }
                    Game.channel.gameRequest("r.quickstart", buf, rspObject);
                }, this)

                // 进入房间
                let enter = itemNode.getChildByName("enter");
                enter.off("click");
                enter.on("click", () => {
                    let buf = JoinRoom.encode({roomId: item.roomId}).finish()
                    let rspObject: CallbackObject = {
                        target: this,
                        callback: (cmd: number, data: any) => {
                            let resp = JoinRoomResp.decode(data.body);
                            Game.log.logNet(resp, "进入房间");
                            if (resp.code == ErrorCode.OK) {
                                uiManager.open(UIID.UIRoom, resp.roomInfo)
                            }
                        }
                    }
                    Game.channel.gameRequest("r.joinroom", buf, rspObject);
                }, this)
            }

        });
        this.listView.reload();
    }

    getRoomList() {
        if (!uiManager.isTopUI(UIID.UIHall)) {
            return;
        }
        let buf = GetRoomList.encode({}).finish()
        let rspObject: CallbackObject = {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = GetRoomListResp.decode(data.body);
                if (resp.code == ErrorCode.OK) {
                    this.refreshHallList(resp.roomList);
                }
            }
        }
        Game.channel.gameRequest("r.getroomlist", buf, rspObject);
    }
}
