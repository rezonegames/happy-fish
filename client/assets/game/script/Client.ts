import {_decorator, find, Component, Node, ProgressBar, UITransform, v3, v2, Button, Label} from "cc";
import {
    Action,
    LoginToGameResp,
    NotifyUpdateFrame,
    SitDown,
    SitDownResp,
    UserInfo
} from "db://assets/game/script/proto/client";
import {ActionType} from "db://assets/game/script/proto/consts";
import {Game, UIID} from "db://assets/game/script/game";
import Weapon from "db://assets/game/script/weapon";
import UIFishGround from "db://assets/game/script/ui-fishground";
import {ErrorCode} from "db://assets/game/script/proto/error";
import {uiManager} from "db://assets/core/ui/ui-manager";

const {ccclass, property} = _decorator;

@ccclass
export default class Client extends Component {
    weapon: Weapon;
    @property(ProgressBar) energy!: ProgressBar
    @property(Button) sitDown: Button
    @property(Label) nname: Label;
    userInfo: UserInfo;
    fishGround: UIFishGround;
    seatId: number

    onLoad() {
        this.node.getComponent(UITransform).priority = 30;
        this.clearUser();
    }

    initUser(userInfo: UserInfo, fishGround: UIFishGround) {
        this.fishGround = fishGround;
        this.userInfo = userInfo;
        this.weapon = this.node.getChildByName("weapon").getComponent(Weapon);
        this.weapon.initWeapon(this);
        this.sitDown.node.active = false;
        this.nname.string = this.userInfo.name;
    }

    setSeatId(seatId: number) {
        this.seatId = seatId;
    }

    getSeatId() {
        return this.seatId;
    }

    clearUser() {
        this.userInfo = null;
        this.sitDown.node.active = true;
        this.nname.node.active = false;
    }

    isMy() {
        return this.userInfo.userId === Game.storage.getUser()
    }

    getWeapon() {
        return this.weapon.getWeapon()
    }

    getCannonWorldPos() {
        return this.weapon.getCannonWorldPos();
    }

    onClickSit() {
        Game.channel.gameRequest("r.sitdown", SitDown.encode({
            tableId: this.fishGround.tableInfo.tableId,
            password: "",
            seatId: this.seatId,
        }).finish(), {
            target: this,
            callback:(cmd: number, data: any) => {
                let resp = SitDownResp.decode(data.body);
                Game.log.logNet(JSON.stringify(resp), "onClickSit");
                if (resp.code == ErrorCode.OK) {
                    // ok
                } else {
                    uiManager.open(UIID.UIToast, `sit down err: ${resp.code}`);
                }
            }
        });
    }

    // 每发射一枚炮弹，能量加1
    setEnergy(addVal: number) {
        this.energy.progress += addVal;
    }

    // doAction 由服务器broadcast
    doAction(action: Action) {
        // 射击
        const doShoot = (valList: string[]) => {
            let x = parseFloat(valList[0]);
            let y = parseFloat(valList[1]);
            let level = parseInt(valList[2]);
            // Game.log.logNet("doShoot", `${x}:${y}:${level}`);
            let touchPos = v3(x, y, 0);
            let weaponPos = this.getCannonWorldPos();
            let dir = touchPos.subtract(weaponPos);
            let angle = v2(dir.x, dir.y).signAngle(v2(0, 1));
            let degree = angle / Math.PI * 180;
            this.weapon.setCannonAngle(-degree);
            this.fishGround.shoot(-degree, level, this);
            // todo：根据武器的level设置energy也可以
            this.setEnergy(1);
        }
        // 播放杀鱼动画
        const doKillFish = (valList: string[]) => {
            valList.forEach((fishId) => {
                let fish = this.fishGround.getFish(fishId);
                if (fish) {
                    let pos = fish.getWorldPosition();
                    let addCoins = fish.getCoin();
                    this.fishGround.gainCoin(pos, addCoins);
                    fish.die();
                }
            })
        }
        // 武器升级
        const doWeaponLevelUp = (valList: string[]) => {
            let value = valList[0];
            this.weapon.setWeapon(parseInt(value));
        }
        const valList = action.valList;
        switch (action.key) {
            case ActionType.Shoot:
                doShoot(valList);
                break;
            case ActionType.Kill_Fish:
                doKillFish(valList);
                break;
            case ActionType.Weapon_LevelUp:
                doWeaponLevelUp(valList);
                break;
            case ActionType.Skill:
                break;
            default:
                break;
        }
    }

    update() {

    }
}