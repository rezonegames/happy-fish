import {_decorator, Component, Animation, find, Vec3, Sprite, UITransform} from "cc";
import UIFishGround from "./ui-fishground";
import {Game} from "db://assets/game/script/game";

const {ccclass, property} = _decorator;

@ccclass
export default class CoinUp extends Component {

    @property(Animation) anim: Animation = null;
    @property(Sprite) gain_x: Sprite;
    @property(Sprite) gain_1: Sprite;
    @property(Sprite) gain_0: Sprite;
    fishGround: UIFishGround;

    initCoin(pos: Vec3, gain: number, fishGround: UIFishGround) {
        this.node.parent = fishGround.node;
        // this.node.getComponent(UITransform).priority = 1;
        this.node.setSiblingIndex(3);
        this.fishGround = fishGround;
        this.node.position = pos;
        this.gain_x.spriteFrame = this.fishGround.getSpriteFrame1("goldnum_x");
        this.gain_1.spriteFrame = this.fishGround.getSpriteFrame1(`goldnum_${Math.floor(gain / 10)}`);
        this.gain_0.spriteFrame = this.fishGround.getSpriteFrame1(`goldnum_${gain % 10}`);
        let animName = "coin-up";
        //@ts-ignore
        this.anim.once("finished", this.onAnimationFinished, this);
        this.anim.play(animName);
    }

    // onAnimationFinished 定义动画结束后的回调函数
    onAnimationFinished() {
        Game.log.logView("onAnimationFinished", "coin_up");
        this.fishGround.collectCoin(this.node);
    }

    update(dt) {

    }
}