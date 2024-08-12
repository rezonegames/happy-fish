import {_decorator, Component, Sprite, find, UITransform, v3, v2, RigidBody2D, Contact2DType,
    Collider2D, IPhysics2DContact} from "cc";
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
    speed: number = 60;
    client: Client;
    fishGround: UIFishGround;
    @property(RigidBody2D) rigidbody: RigidBody2D;

    initBullet(angle: number, level: number, client: Client, fishGround: UIFishGround) {
        this.node.parent = find("Canvas");
        this.node.getComponent(UITransform).priority = 20;
        this.level = level;
        this.fishGround = fishGround;
        this.client = client;
        this.node.getComponent(Sprite).spriteFrame = this.fishGround.getSpriteFrame(`bullet${level}`);
        this.node.angle = angle;
        this.node.position = client.getCannonWorldPos();
        // 获取节点的角度（假设角度是以度数为单位）
        const angleInDegrees = this.node.angle + 90;
        const angleInRadians = angleInDegrees * (Math.PI / 180);
        let direction = v2(Math.cos(angleInRadians), Math.sin(angleInRadians));
        // 设置移动速度
        this.rigidbody.linearVelocity = direction.multiplyScalar(this.speed);
        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        let fishId = otherCollider.node.getComponent(Fish).getFishId();
        if (this.client.isMy()) {
            // 我的子弹发射的，要通知服务器
            Game.channel.gameNotify("r.updateframe", NotifyUpdateFrame.encode({
                action: {
                    key: ActionType.Hit_Fish,
                    valList: [fishId]
                }
            }).finish());
        }
        this.fishGround.castFishNet(this.node.position, this.level);
        Game.log.logView("onBeginContact", `fish: ${fishId} level: ${this.level}`);
        this.scheduleOnce(()=>{
            Game.log.logView("collectBullet");
            this.fishGround.collectBullet(this.node);
        }, 0);

    }

    update(dt) {
        let pos = this.node.position;
        let bx = pos.x, by = pos.y;
        let width = 1280, height = 720;
        if (bx > width / 2 + 100
            || bx < -width / 2 - 100
            || by > height / 2 + 100
            || by < -height / 2 - 100
        ) {
            this.fishGround.collectBullet(this.node);
        }
    }
}