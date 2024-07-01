import {_decorator, Label, Prefab, NodePool, Component, Node} from "cc";
import {UIView} from "db://assets/core/ui/UIView";
import {EventMgr} from "db://assets/core/common/EventManager";
import {OnFrame, UserInfo, TableInfo, OnTableAction, FishInfo} from "db://assets/game/script/proto/client";
import {TableAction} from "db://assets/game/script/proto/consts";
import {Game} from "db://assets/game/script/Game";
import Client from "db://assets/game/script/Client";

const {ccclass, property} = _decorator;

@ccclass
export default class UIGame extends UIView {

    // 鱼
    @property(Prefab)
    fishPrefab: Prefab;

    @property([Node])
    clientNodeList: Node[] = [];

    // 玩家
    clientMap: { [key: string]: Client } = {};

    // 我
    my: Client;

    fishNodePool: NodePool;

    public onOpen(fromUI: number, ...args: any): void {
        super.onOpen(fromUI, ...args);

        EventMgr.addEventListener("onState", this.onState, this);
        EventMgr.addEventListener("onFrame", this.onFrame, this);

        let tableInfo = args[0] as TableInfo;
        let {
            users,
            room,
        } = tableInfo;

        for (const [userId, player] of Object.entries(users)) {
            this.setUser(player);
        }
    }

    public onClose(): any {
        super.onClose();

        EventMgr.removeEventListener("onState", this.onState, this);
        EventMgr.removeEventListener("onFrame", this.onFrame, this);
    }

    // getSeatUIPlayer 通过座位号获取UIPlayer对象
    getSeatClient(seatId: Number) {
        let client: Client;
        for (let i = 0; i < this.clientNodeList.length; i++) {
            if (i === seatId) {
                let node = this.clientNodeList[i];
                client = node.getComponent("Client") as Client;
            }
        }
        if (!client) {
            throw new Error(`getSeatClient not found seatId: ${seatId}`)
        }

        return client;
    }

    getClient(userId: string) {
        return this.clientMap[userId];
    }

    // setUser 加入
    setUser(user: UserInfo) {
        const {
            userId,
            seatId,
        } = user;

        try {
            let client = this.getSeatClient(seatId);
            client.initUser(user);
            if (userId === Game.storage.getUser()) {
                this.my = client;
            }
            this.clientMap[userId] = client;
        } catch (e) {
            Game.log.logView("setUser", `${userId} err ${e.message}`);
        }
    }

    // delUser 离开
    delUser(user: UserInfo) {
        const {
            userId,
            seatId,
        } = user;

        try {
            let client = this.getSeatClient(seatId);
            client.clearUser(user);
            delete this.clientMap[userId];

        } catch (e) {
            Game.log.logView("delUser", `${userId} err ${e.message}`);
        }
    }

    // bornFishes 生鱼
    bornFishes(fishList: FishInfo[]) {

    }

    // 桌子的自身的操作，比如坐下一个玩家，离开一个玩家，出鱼
    onTableAction(eventName: string, eventData: OnTableAction) {
        const {
            action,
            user,
            fishList,
        } = eventData;

        switch (action) {
            case TableAction.ADD_USER:
                this.setUser(user);
                break;
            case TableAction.BORN_FISH:
                this.bornFishes(fishList);
                break;
            case TableAction.LEAVE_USER:
                this.delUser(user);
                break;
        }
    }

    // 玩家操作
    onFrame(eventName: string, eventData: OnFrame) {
        const {
            userId,
            action,
        } = eventData;
    }

    // onState 暂不处理，这种没有
    onState(eventName: string, eventData: TableInfo) {

    }
}
