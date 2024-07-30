import {_decorator, Component, Sprite, SpriteAtlas, Animation, Vec3, find, tween, v3} from "cc";
import {FishInfo} from "db://assets/game/script/proto/client";
import UIFishGround from "db://assets/game/script/ui-fishground";

const {ccclass, property} = _decorator;

@ccclass
export default class Fish extends Component {
    @property(SpriteAtlas) atlas: SpriteAtlas = null;
    @property(Animation) anim: Animation = null;
    lastPosition: Vec3 = null; // 计算角度用的
    fishInfo: FishInfo
    fishGround: UIFishGround

    getFishId() {
        return this.fishInfo.fishId;
    }

    initFish(fishInfo: FishInfo, fishGround: UIFishGround) {
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
        this.node.getComponent(Sprite).spriteFrame = this.atlas.getSpriteFrame(name + "_run_0");
        this.anim.play(name + "_run");
        let bornPos = actionList[0];
        this.node.parent = find("canvas");
        this.node.position = new Vec3(bornPos.x, bornPos.y, 0);
        let sequence = tween().target(this.node);
        for (let i = 1; i < actionList.length; i++) {
            const {
                x,
                y,
                tweenInfo,
                seconds,
            } = actionList[i]
            sequence = sequence.to(seconds, {position: new Vec3(x, y, 0)}, {
                //@ts-ignore
                easing: tweenInfo.id,
            });
        }
        sequence.start();
    }

    die() {
        const animName  = this.fishInfo.name + "_die";
        this.anim.getState(animName).on("stop", (event)=>{
            this.fishGround.collectFish(this.node);
        });
        this.anim.play(animName);
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