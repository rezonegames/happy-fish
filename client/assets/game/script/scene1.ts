import {Component, _decorator} from "cc";
import {Game} from "db://assets/game/script/game";

const {ccclass} = _decorator;

@ccclass
export default class Scene1 extends Component {
    onLoad() {
    }
    start() {
        Game.InitGame();
    }
}
