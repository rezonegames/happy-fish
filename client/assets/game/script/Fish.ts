import {_decorator, Component, Node, Prefab, NodePool} from "cc";
import {FishInfo} from "db://assets/game/script/proto/client";

const {ccclass, property} = _decorator;

@ccclass
export default class Fish extends Component {

    fishInfo: FishInfo

    initFish(fishInfo: FishInfo) {
        this.fishInfo = fishInfo;
    }
}