import {_decorator, Component, Node, Button, Prefab, NodePool} from "cc";
import {Action, UserInfo} from "db://assets/game/script/proto/client";

const {ccclass, property} = _decorator;

@ccclass
export default class Client extends Component {

    @property(Node)
    weaponNode: Node

    @property(Node)
    coinNode: Node

    @property(Button)
    addButtonNode: Button

    @property(Button)
    subButtonNode: Button

    @property(Prefab)
    netPrefab: Prefab

    netNodePool: NodePool

    userInfo: UserInfo;

    undoActionList: Action[] = [];

    initUser(userInfo: UserInfo) {
        this.userInfo = userInfo;
    }

    clearUser(userInfo: UserInfo) {
        this.userInfo = null;
    }

    // addAction 由服务器broadcast
    addAction(action: Action) {
        this.undoActionList.push(action);
    }

    update() {

    }
}