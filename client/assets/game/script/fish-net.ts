import {_decorator, Component, Animation, find} from "cc";
import UIFishGround from "./ui-fishground";
const {ccclass, property} = _decorator;

@ccclass
export default class FishNet extends Component {

    @property(Animation) anim: Animation = null;

    initFishNet(level: number, fishGround: UIFishGround) {
        this.node.parent = find("canvas");
        let animName = "net_" + level;
        this.anim.getState(animName).on("stop", (event)=>{
            fishGround.collectFishNet(this.node);
        });
        this.anim.play(animName);
    }

    update(dt) {

    }
}