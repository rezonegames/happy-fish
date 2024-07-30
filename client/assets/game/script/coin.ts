import {_decorator, Component, Animation, find} from "cc";
import UIFishGround from "./ui-fishground";
const {ccclass, property} = _decorator;

@ccclass
export default class Coin extends Component {

    @property(Animation) anim: Animation = null;

    initCoin(count: number, fishGround: UIFishGround) {
        this.node.parent = find("canvas");
        let animName = "coin";
        this.anim.getState(animName).on("stop", (event)=>{
            fishGround.collectCoin(this.node);
        });
        this.anim.play(animName);
    }

    update(dt) {

    }
}