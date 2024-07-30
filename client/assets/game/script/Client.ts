import {_decorator, Button, Component, Node, NodePool, Prefab, Vec3} from "cc";
import {Action, NotifyUpdateFrame, UserInfo} from "db://assets/game/script/proto/client";
import {ActionType} from "db://assets/game/script/proto/consts";
import {Game} from "db://assets/game/script/game";
import Weapon from "db://assets/game/script/weapon";
import UIFishGround from "db://assets/game/script/ui-fishground";

const {ccclass, property} = _decorator;

@ccclass
export default class Client extends Component {

    @property(Node) weaponNode: Node
    weapon: Weapon;
    userInfo: UserInfo;
    fishGround: UIFishGround;

    initUser(userInfo: UserInfo) {
        this.userInfo = userInfo;
        this.weapon = this.weaponNode.getComponent(Weapon);
        this.weapon.initWeapon(this);
    }

    clearUser() {
        this.userInfo = null;
    }

    isMy() {
        return this.userInfo.userId === Game.storage.getUser()
    }

    getWeaponPosition() {
        return this.weaponNode.getPosition();
    }

    // doAction 由服务器broadcast
    doAction(action: Action) {
        // 射击
        const doShoot = (valList: string[]) => {
            let x = parseInt(valList[0]);
            let y = parseInt(valList[1]);
            let level = parseInt(valList[2]);
            let pos = new Vec3(x, y, 0);
            this.fishGround.shootBullet(pos, level, this,);
        }

        // 播放杀鱼动画
        const doKillFish = (valList: string[]) => {
            valList.forEach((fishId)=>{
                let fish = this.fishGround.getFish(fishId);
                if(fish) {
                    fish.die();
                    this.fishGround.gainCoin(100);
                }
            })
        }
        // 武器升级
        const doWeaponLevelUp = (valList: string[]) => {
            let value = valList[0];
            this.weaponNode.getComponent(Weapon).setWeapon(parseInt(value));
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