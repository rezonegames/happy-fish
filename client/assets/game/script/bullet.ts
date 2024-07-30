import {_decorator, Component, Sprite, Vec3} from "cc";
import Client from "db://assets/game/script/client";
import UIFishGround from "db://assets/game/script/ui-fishground";
import {Game} from "db://assets/game/script/game";
import {NotifyUpdateFrame} from "./proto/client";
import {ActionType} from "./proto/consts";
import Fish from "./fish";

const {ccclass, property} = _decorator;

@ccclass
export default class Bullet extends Component {

    level: number = 1;
    speed: number = 10;
    client: Client = null;
    fishGround: UIFishGround = null;
    direction: Vec3 = null;

    initBullet(pos: Vec3, level: number, client: Client, fishGround: UIFishGround) {
        this.level = level;
        // let weaponList = Game.config.weapon;
        // let weaponInfo = weaponList.filter(w => w.level === level);
        this.client = client;
        this.fishGround = fishGround;
        this.node.getComponent(Sprite).spriteFrame = this.fishGround.spAtlas.getSpriteFrame(`bullet_${level}`);
        let dir = pos.subtract(this.client.getWeaponPosition());
        let angle = Math.atan2(dir.y, dir.x);
        let degree = angle / Math.PI * 180;
        this.node.angle = -degree;
        this.direction = dir;
    }

    onCollisionEnter(other, self) {
        // 我的子弹发射的，要通知服务器
        if (this.client.isMy()) {
            let fish = other as Fish;
            Game.channel.gameNotify("r.updateframe", NotifyUpdateFrame.encode({
                action: {
                    key: ActionType.Hit_Fish,
                    valList: [fish.fishInfo.fishId]
                }
            }).finish());
        }
        // 回收子弹
        this.fishGround.collectBullet(this.node);
        // 生成网
        this.fishGround.castFishNet(this.level);
    }

    update(dt) {
        let displacement = this.direction.multiplyScalar(this.speed * dt);
        let newPosition = this.node.position.add(displacement);
        this.node.setPosition(newPosition);
    }
}