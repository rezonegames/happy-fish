import {_decorator, Label, Node, Prefab, EditBox, instantiate} from "cc";
import {UIView} from "db://assets/core/ui/ui-view";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {uiManager} from "db://assets/core/ui/ui-manager";
import {Game, UIID} from "db://assets/game/script/game";
import {
    CreateTable,
    CreateTableResp,
    GetTableList, GetTableListResp, JoinTable, JoinTableResp,
    LeaveRoom,
    LeaveRoomResp,
    RoomInfo, TableInfo
} from "db://assets/game/script/proto/client";

const {ccclass, property} = _decorator;

@ccclass
export default class UIRoom extends UIView {

    @property(ListView) private listView: ListView
    @property(Label) private info: Label
    @property(EditBox) private myTableId: EditBox
    @property(EditBox) private myPassword: EditBox
    intervalTimer
    roomId: string
    @property(Prefab) private tablePrefab: Prefab;

    public onOpen(fromUI: number, ...args: any): void {
        super.onOpen(fromUI, ...args);
        let room = args[0] as RoomInfo;
        this.roomId = room.roomId;

        setTimeout(() => {
            this.getRoomInfo();
        }, 100);
        // 房间列表每5秒刷新一次
        this.intervalTimer = setInterval(() => {
            this.getRoomInfo();
        }, 3000);
    }

    onClose(): any {
        super.onClose();
        clearInterval(this.intervalTimer);
    }

    onBackToHall() {
        Game.channel.gameRequest("r.leave", LeaveRoom.encode({roomId: ""}).finish(), {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = LeaveRoomResp.decode(data.body);
                if (resp.code == ErrorCode.OK) {
                    uiManager.close();
                }
            }
        });
    }

    onCreateTable() {
        let [tableId, password] = [this.myTableId.string, this.myPassword.string];
        Game.channel.gameRequest("r.createtable", CreateTable.encode({tableId, password}).finish(), {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = CreateTableResp.decode(data.body);
                if (resp.code == ErrorCode.OK) {
                    let tableInfo = resp.table
                    uiManager.open(UIID.UIRoom_Table, tableInfo);
                } else {
                }
            }
        });
    }

    refreshTableList(tableList: TableInfo[]) {
        // 以三个为一组，再次分组
        let groupedLists = [];
        tableList = tableList.sort((a: TableInfo, b: TableInfo) => {
            return a.createTime - b.createTime;
        })
        for (let i = 0; i < tableList.length; i += 5) {
            let group = tableList.slice(i, i + 5);
            groupedLists.push(group);
        }
        this.listView.setDelegate({
            items: () => groupedLists,
            reuse: (itemNode: Node, itemList: TableInfo[]) => {
                let children = itemNode.children;
                // 先把所有的tableNode active设置为false，再根据
                for (let i = 0; i < children.length; i++) {
                    let tableNode = children[i];
                    tableNode.active = false;
                }

                for (let i = 0; i < itemList.length; i++) {
                    let tableInfo = itemList[i];
                    let [tableNode, ok] = children.length - 1 >= i ? [children[i], true] : [
                        instantiate(this.tablePrefab), false
                    ];

                    tableNode.getChildByName("Label").getComponent(Label).string = `桌子ID：${tableInfo.tableId}`;

                    let {users} = tableInfo;
                    let desc = ""

                    for (const [uid, player] of Object.entries(users)) {
                        desc += `\n玩家：${uid} 名字：${player.name}`;
                    }
                    tableNode.getChildByName("Label-001").getComponent(Label).string = desc;

                    tableNode.getChildByName("Button").off("click");
                    tableNode.getChildByName("Button").on("click", () => {
                        this.joinTable(tableInfo.tableId);
                    })

                    tableNode.active = true;
                    if (!ok) {
                        itemNode.addChild(tableNode);
                    }
                }
            }

        });
        this.listView.reload();
    }

    joinTable(tableId: string) {
        Game.channel.gameRequest("r.jointable", JoinTable.encode({tableId}).finish(), {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = JoinTableResp.decode(data.body);
                if (resp.code == ErrorCode.OK) {
                }
            }
        });
    }

    getRoomInfo() {
        if (!uiManager.isTopUI(UIID.UIRoom)) {
            return;
        }

        Game.channel.gameRequest("r.getroominfo", GetTableList.encode({
            roomId: this.roomId,
            limit: 0,
            from: 0,
        }).finish(), {

            target: this,
            callback: (cmd: number, data: any) => {

                let resp = GetTableListResp.decode(data.body);
                if (resp.code == ErrorCode.OK) {
                    let tableList = resp.tableList;
                    this.refreshTableList(tableList);
                }
            }
        });
    }

}
