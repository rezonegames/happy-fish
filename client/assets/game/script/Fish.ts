import {_decorator, Component, Sprite, Graphics, Animation, Vec3, find, tween, UITransform, bezier} from "cc";
import {FishInfo} from "db://assets/game/script/proto/client";
import UIFishGround from "db://assets/game/script/ui-fishground";
import {Game} from "db://assets/game/script/game";

const {ccclass, property} = _decorator;

@ccclass
export default class Fish extends Component {
    @property(Animation) anim: Animation = null;
    lastPosition: Vec3; // 计算角度用的
    fishInfo: FishInfo
    fishGround: UIFishGround
    tempId: string

    getFishId() {
        return this.fishInfo.fishId;
    }

    getWorldPosition() {
        return this.node.getWorldPosition()
    }

    getCoin() {
        return this.fishInfo.coin;
    }

    initFish(fishInfo: FishInfo, fishGround: UIFishGround) {
        this.node.parent = find("Canvas");
        this.node.getComponent(UITransform).priority = 20;
        // priority
        this.fishInfo = fishInfo;
        this.fishGround = fishGround;
        const {
            fishId,
            name,
            coin,
            hp,
            dodgeRate,
            defenceValue,
            bornTime,
            actionList,
        } = this.fishInfo;
        this.tempId = `${fishId}-${Game.random.randomWord(true, 3, 5)}`;
        this.node.getComponent(Sprite).spriteFrame = this.fishGround.getSpriteFrame(name + "_run_0");
        this.anim.play(name + "_run");
        let bornPos = actionList[0];
        this.node.position = new Vec3(bornPos.x, bornPos.y, 0);
        // 三维空间的缓动
        const bezierCurve = (t: number, p1: Vec3, cp1: Vec3, cp2: Vec3, p2: Vec3): Vec3 => {
            let out = new Vec3();
            out.x = bezier(p1.x, cp1.x, cp2.x, p2.x, t)
            out.y = bezier(p1.y, cp1.y, cp2.y, p2.y, t)
            out.z = bezier(p1.z, cp1.z, cp2.z, p2.z, t)
            return out
        }
        let startPos, p2, p3, endPos, duration = 0;
        let hh = [];
        for (let i = 0; i < actionList.length; i++) {
            let action = actionList[i];
            let pos = new Vec3(action.x, action.y, 0);
            hh.push(pos.y);
            switch (i) {
                case 0:
                    startPos = pos
                    break
                case 1:
                    p2 = pos
                    break
                case 2:
                    p3 = pos;
                    break
                case 3:
                    endPos = pos;
                    break
            }
            duration += action.seconds;
        }
        // 测试
        // this.fishGround.drawTest(startPos, p2, p3, endPos);
        // 真实
        tween(this.node)
            .to(
                duration,
                {position: endPos},
                {
                    onUpdate: (target, ratio) => {
                        let out = bezierCurve(ratio, startPos, p2, p3, endPos)
                        this.node.setPosition(out)
                    },
                    onComplete: (target: Vec3) => {
                        // Game.log.logView(`${this.tempId} die ${duration}`);
                        this.fishGround.collectFish(this.node);
                    }
                }
            )
            .start()
        // Game.log.logView(`initFish ${this.tempId}`, `${endPos.x}-${duration}-${JSON.stringify(hh)}`);
    }

    die() {
        const animName = this.fishInfo.name + "_die";
        //@ts-ignore
        this.anim.once("finished", this.onAnimationFinished, this);
        this.anim.play(animName);
    }

    // onAnimationFinished 定义动画结束后的回调函数
    onAnimationFinished() {
        Game.log.logView("onAnimationFinished", "fish-die");
        this.fishGround.collectFish(this.node);
    }

    update(dt) {
        let currentPos = this.node.getPosition();
        if (Vec3.len(this.lastPosition.subtract(currentPos)) < 1) {
            return;
        }
        let dir = currentPos.subtract(this.lastPosition);
        let angle = Math.atan2(dir.y, dir.x);
        let degree = angle / Math.PI * 180;
        this.node.angle = -degree;
        this.lastPosition = currentPos;
    }
}