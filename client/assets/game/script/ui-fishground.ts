import {
    _decorator, Graphics, Prefab, NodePool, Vec3, Node, instantiate, SpriteAtlas,
    SpriteFrame, UITransform, find, AudioSource
} from "cc";
import {UIView} from "db://assets/core/ui/ui-view";
import {EventMgr} from "db://assets/core/common/event-manager";
import {
    OnFrame,
    UserInfo,
    TableInfo,
    OnTableAction,
    FishInfo,
    NotifyUpdateFrame, SitDown, SitDownResp, LeaveRoom, LeaveRoomResp, StandUp, StandUpResp
} from "db://assets/game/script/proto/client";
import {ActionType, TableAction} from "db://assets/game/script/proto/consts";
import {Game, UIID} from "db://assets/game/script/game";
import Client from "db://assets/game/script/client";
import Fish from "db://assets/game/script/fish";
import FishNet from "db://assets/game/script/fish-net";
import Bullet from "db://assets/game/script/bullet";
import CoinUp from "db://assets/game/script/coin-up";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {uiManager} from "db://assets/core/ui/ui-manager";

const {ccclass, property} = _decorator;

@ccclass
export default class UIFishGround extends UIView {

    clientMap: { [key: string]: Client } = {};
    @property(Graphics) graphics: Graphics
    // 几个池子都放在game，所有人公用，不放在client里，不合理
    @property(Prefab) fishPrefab: Prefab
    @property(Prefab) fishNetPrefab: Prefab
    @property(Prefab) bulletPrefab: Prefab
    @property(Prefab) coinUpPrefab: Prefab

    fishPool: NodePool;
    fishNetPool: NodePool;
    bulletPool: NodePool;
    coinUpPool: NodePool;
    // 图集
    @property(SpriteAtlas) spAtlas: SpriteAtlas;
    @property(SpriteAtlas) coinAtlas: SpriteAtlas;
    // 鱼群
    fishMap: { [key: string]: Fish } = {};
    tableInfo: TableInfo;
    @property(AudioSource) music: AudioSource;

    getSpriteFrame(name: string): SpriteFrame {
        return this.spAtlas.getSpriteFrame(name);
    }

    getSpriteFrame1(name: string): SpriteFrame {
        return this.coinAtlas.getSpriteFrame(name);
    }

    drawTest(startPos, p2, p3, endPos) {
        this.graphics.moveTo(startPos.x, startPos.y);
        this.graphics.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, endPos.x, endPos.y);
        this.graphics.stroke();
    }

    getTableId() {
        return this.tableInfo.tableId;
    }

    public onOpen(fromUI: number, ...args: any): void {
        super.onOpen(fromUI, ...args);
        Game.log.logView("UIFishGround open");
        this.music.play();
        this.node.getChildByName("background").setSiblingIndex(0);
        EventMgr.addEventListener("onTableAction", this.onTableAction, this);
        EventMgr.addEventListener("onFrame", this.onFrame, this);
        // 初始化client
        for (let i = 1; i <= 6; i++) {
            let client = this.getSeatClient(i);
            client.init(this, i);
        }
        this.fishPool = new NodePool();
        this.fishNetPool = new NodePool();
        this.bulletPool = new NodePool();
        this.coinUpPool = new NodePool();
        let tableInfo = args[0] as TableInfo;
        this.tableInfo = tableInfo;
        let {
            users,
            room,
        } = tableInfo;
        for (const [userId, player] of Object.entries(users)) {
            this.setUser(player);
        }
        let uiTransform = find("Canvas").getComponent(UITransform);
        this.node.on(Node.EventType.TOUCH_START, (event) => {
            let myClient = this.clientMap[Game.storage.getUser()];
            if (!myClient) {
                return;
            }
            // 触点是世界坐标，需要转换为和炮台一致的坐标系下
            let touch = event.touch;
            let x = touch.getUILocationX();
            let y = touch.getUILocationY();
            let touchPos = uiTransform.convertToNodeSpaceAR(new Vec3(x, y, 0));
            let myWeapon = myClient.getWeapon();
            let weaponId = myWeapon.weaponId;
            // 点击的命令发出
            Game.channel.gameNotify("r.updateframe", NotifyUpdateFrame.encode({
                action: {
                    key: ActionType.Shoot,
                    valList: [touchPos.x.toString(), touchPos.y.toString(), weaponId],
                }
            }).finish());
        }, this);
    }

    public onClose(): any {
        super.onClose();
        EventMgr.removeEventListener("onTableAction", this.onTableAction, this);
        EventMgr.removeEventListener("onFrame", this.onFrame, this);
    }

    public onClickStandUp() {
        Game.channel.gameRequest("r.standup", StandUp.encode({}).finish(), {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = StandUpResp.decode(data.body);
                Game.log.logNet(JSON.stringify(resp), "onClickLeaveRoom");
                if (resp.code == ErrorCode.OK) {
                } else {
                    uiManager.open(UIID.UIToast, `Stand Up Err: ${resp.code}`);
                }
            }
        });
    }

    public onClickLeaveRoom() {
        Game.channel.gameRequest("r.leaveroom", LeaveRoom.encode({roomId: this.tableInfo.room?.roomId}).finish(), {
            target: this,
            callback: (cmd: number, data: any) => {
                let resp = LeaveRoomResp.decode(data.body);
                Game.log.logNet(JSON.stringify(resp), "onClickLeaveRoom");
                if (resp.code == ErrorCode.OK) {
                    // 回收鱼
                    for(const [k, v] of Object.entries(this.fishMap)) {
                        this.collectFish(v.node)
                    }
                    this.music.stop();
                    uiManager.replace(UIID.UIHall);
                } else {
                    uiManager.open(UIID.UIToast, `Leave Room Err: ${resp.code}`);
                }
            }
        });
    }

    findNodeByName(root: Node, name: string): Node | null {
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.children.length; i++) {
            const child = root.children[i];
            const found = this.findNodeByName(child, name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    // getSeatUIPlayer 通过座位号获取UIPlayer对象
    getSeatClient(seatId: Number) {
        let node = this.findNodeByName(this.node, `client-${seatId}`);
        if (!node) {
            throw new Error(`seatId: ${seatId} not found`);
        }
        return node.getComponent(Client);
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
        let client = this.getSeatClient(seatId);
        client.initUser(user);
        this.clientMap[userId] = client;
    }

    // delUser 离开
    delUser(user: UserInfo) {
        const {
            userId,
            seatId,
        } = user;
        let client = this.getSeatClient(seatId);
        client.clearUser();
        delete this.clientMap[userId];
    }

    // bornFishes 生鱼
    bornFishes(fishList: FishInfo[]) {
        fishList.forEach((fishInfo: FishInfo) => {
            let fishNode = this.fishPool.get();
            if (!fishNode) {
                fishNode = instantiate(this.fishPrefab);
            }
            let fish = fishNode.getComponent(Fish);
            fish.initFish(fishInfo, this);
            this.fishMap[fishInfo.fishId] = fish;
        })
    }

    collectFish(node: Node) {
        this.fishPool.put(node);
        let fishId = node.getComponent(Fish).getFishId();
        delete this.fishMap[fishId];
    }

    getFish(fishId: string) {
        return this.fishMap[fishId];
    }

    // castFishNet 撒网
    castFishNet(pos: Vec3, level: number) {
        let fishNetNode = this.fishNetPool.get();
        if (!fishNetNode) {
            fishNetNode = instantiate(this.fishNetPrefab);
        }
        fishNetNode.getComponent(FishNet).initFishNet(pos, level, this);
    }

    collectFishNet(fishNet: Node) {
        this.fishNetPool.put(fishNet);
    }

    // shoot 子弹
    shoot(angle: number, level: number, client: Client) {
        let bulletNode = this.bulletPool.get();
        if (!bulletNode) {
            bulletNode = instantiate(this.bulletPrefab);
        }
        bulletNode.getComponent(Bullet).initBullet(angle, level, client, this);
    }

    collectBullet(bullet: Node) {
        this.bulletPool.put(bullet);
    }

    gainCoin(pos: Vec3, count: number) {
        let node = this.coinUpPool.get();
        if (!node) {
            node = instantiate(this.coinUpPrefab);
        }
        node.getComponent(CoinUp).initCoin(pos, count, this);
    }

    collectCoin(node: Node) {
        this.coinUpPool.put(node);
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
        // try {
        //     client.doAction(action);
        // } catch (e) {
        //     Game.log.logNet("onFrame", `err: ${e.message}`)
        // }
    }

    // onState 暂不处理，这种没有
    onState(eventName: string, eventData: TableInfo) {
    }
}
