import {_decorator, Label, Prefab, NodePool, Vec3, Node, instantiate, SpriteAtlas} from "cc";
import {UIView} from "db://assets/core/ui/ui-view";
import {EventMgr} from "db://assets/core/common/event-manager";
import {OnFrame, UserInfo, TableInfo, OnTableAction, FishInfo} from "db://assets/game/script/proto/client";
import {TableAction} from "db://assets/game/script/proto/consts";
import {Game} from "db://assets/game/script/game";
import Client from "db://assets/game/script/client";
import Fish from "db://assets/game/script/fish";
import FishNet from "db://assets/game/script/fish-net";
import Bullet from "db://assets/game/script/bullet";
import Coin from "db://assets/game/script/coin";

const {ccclass, property} = _decorator;

@ccclass
export default class UIFishGround extends UIView {

    @property([Node])
    clientNodeList: Node[] = [];
    clientMap: { [key: string]: Client } = {};

    // 几个池子都放在game，所有人公用，不放在client里，不合理
    @property(Prefab) fishPrefab: Prefab;
    @property(Prefab) fishNetPrefab: Prefab;
    @property(Prefab) bulletPrefab: Prefab;
    @property(Prefab) coinPrefab: Prefab;

    fishNodePool: NodePool;
    fishNetNodePool: NodePool;
    bulletNodePool: NodePool;
    coinNodePool: NodePool;

    // 图集
    @property(SpriteAtlas) spAtlas: SpriteAtlas = null;

    // 鱼群
    fishMap: { [key: string]: Fish } = {};

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
                client = node.getComponent(Client);
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
            client.clearUser();
            delete this.clientMap[userId];
        } catch (e) {
            Game.log.logView("delUser", `${userId} err ${e.message}`);
        }
    }

    // bornFishes 生鱼
    bornFishes(fishList: FishInfo[]) {
        fishList.forEach((fishInfo: FishInfo) => {
            let fishNode = this.fishNodePool.get();
            if (!fishNode) {
                let fishNode = instantiate(this.fishPrefab);
                this.fishNodePool.put(fishNode);
            }
            let fish = fishNode.getComponent(Fish);
            fish.initFish(fishInfo, this);
            this.fishMap[fishInfo.fishId] = fish;
        })
    }

    collectFish(node: Node) {
        this.fishNodePool.put(node);
        let fishId = node.getComponent(Fish).getFishId();
        delete this.fishMap, fishId;
    }

    getFish(fishId: string) {
        return this.fishMap[fishId];
    }

    // castFishNet 撒网
    castFishNet(level: number) {
        let fishNetNode = this.fishNetNodePool.get();
        if (!fishNetNode) {
            fishNetNode = instantiate(this.fishNetPrefab);
            this.fishNetNodePool.put(fishNetNode);
        }
        fishNetNode.getComponent(FishNet).initFishNet(level, this);
    }

    collectFishNet(fishNet: Node) {
        this.fishNetNodePool.put(fishNet);
    }

    // shootBullet 子弹
    shootBullet(pos: Vec3, level: number, client: Client) {
        let bulletNode = this.bulletNodePool.get();
        if (!bulletNode) {
            bulletNode = instantiate(this.bulletPrefab);
            this.bulletNodePool.put(bulletNode);
        }
        bulletNode.getComponent(Bullet).initBullet(pos, level, client, this);
    }

    collectBullet(bullet: Node) {
        this.bulletNodePool.put(bullet);
    }

    // 加金币
    gainCoin(count: number) {
        let node = this.coinNodePool.get();
        if (!node) {
            node = instantiate(this.coinPrefab);
            this.coinNodePool.put(node);
        }
        node.getComponent(Coin).initCoin(count, this);
    }

    collectCoin(node: Node) {
        this.coinNodePool.put(node);
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
        let client = this.getClient(userId);
        client.doAction(action);
    }

    // onState 暂不处理，这种没有
    onState(eventName: string, eventData: TableInfo) {
    }
}
