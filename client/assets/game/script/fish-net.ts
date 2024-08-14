import {_decorator, Component, Animation, find, Vec3, UITransform, director} from "cc";
import UIFishGround from "./ui-fishground";
import {Game} from "db://assets/game/script/game";
const {ccclass, property} = _decorator;

@ccclass
export default class FishNet extends Component {

    @property(Animation) anim: Animation;
    fishGround: UIFishGround;

    initFishNet(pos: Vec3, level: number, fishGround: UIFishGround) {
        this.node.parent = fishGround.node;
        // this.node.getComponent(UITransform).priority = 1;
        this.node.setSiblingIndex(3)
        this.fishGround = fishGround;
        this.node.position = pos;

        let animName = "net_" + level;
        //@ts-ignore
        this.anim.once("finished", this.onAnimationFinished, this);
        this.anim.play(animName);
    }

    // onAnimationFinished 定义动画结束后的回调函数
    onAnimationFinished() {
        // Game.log.logView("onAnimationFinished", "fish-net");
        this.fishGround.collectFishNet(this.node);
    }

    update(dt) {

    }
}