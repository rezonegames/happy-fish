import {Color, Prefab, Node, instantiate, UITransform, view} from 'cc';
import {UIConf, uiManager} from "db://assets/core/ui/UIManager";
import {DEBUG} from 'cc/env';
import {Logger} from "db://assets/core/common/Logger";
import {HttpRequest} from "db://assets/core/network/HttpRequest";
import {RandomManager} from "db://assets/core/common/RandomManager";
import {StorageManager} from "db://assets/core/common/StorageManager";
import {NetManager} from "db://assets/core/network/NetManager";
import {EventMgr} from "db://assets/core/common/EventManager";
import {resLoader} from "db://assets/core/res/ResLoader";
import {NetChannelManager} from "db://assets/game/script/Channel";

let colorMap = {
    0: new Color(200, 100, 100),    // 红色
    1: new Color(100, 200, 100),    // 绿色
    2: new Color(100, 100, 200),    // 蓝色
    3: new Color(200, 200, 100),  // 黄色
    4: new Color(200, 100, 200),  // 紫色
    5: new Color(100, 200, 200)   // 青色
}

export function GetTeamColor(teamId): Color {
    return colorMap[teamId];
}

export enum UIID {
    UILogin,
    UILogin_Guest,
    UIRegister,
    UIHall,
    UIRoom,
    UIRoom_Table,
    UIGame,
}

const bundle = "game";

export let UICF: { [key: number]: UIConf } = {
    [UIID.UILogin]: {bundle, prefab: "prefab/Login"},
    [UIID.UILogin_Guest]: {bundle, prefab: "prefab/Login_Guest", preventTouch: true},
    [UIID.UIHall]: {bundle, prefab: "prefab/Hall"},
    [UIID.UIRoom]: {bundle, prefab: "prefab/Room"},
    [UIID.UIRoom_Table]: {bundle, prefab: "prefab/Room_Table"},
    [UIID.UIRegister]: {bundle, prefab: "prefab/Register"},
    [UIID.UIGame]: {bundle, prefab: "prefab/Control"},
}

export class Game {

    // core
    static log = Logger;
    static http: HttpRequest;
    static random = RandomManager.instance;
    static storage: StorageManager;
    static tcp: NetManager;
    static event = EventMgr;
    static res = resLoader;
    static channel: NetChannelManager

    static initGame() {
        Game.log.logView("game init");
        // storage
        Game.storage = new StorageManager();

        // http连接地址
        Game.http = new HttpRequest();
        let url = "http://127.0.0.1:8000";
        if (!DEBUG) {
            url = "http://110.40.133.37:8000";
        }
        Game.http.server = url;

        // 网络管理器
        Game.tcp = new NetManager();

        // tcp的上一层
        Game.channel = new NetChannelManager();
        Game.channel.gameCreate();

        // 初始化界面
        uiManager.initUIConf(UICF);
        uiManager.open(UIID.UILogin);

        Game.log.logView("game init done");
    }

    // openLoading todo：启动一个loading，2秒后关闭，可以放在uimanager里，配置一个loading，onopen之后，销毁之
    static openLoading() {
        let loadingPrefab = Game.res.get("prefab/Loading", Prefab, "bundle1");
        let node = instantiate(loadingPrefab);
        let uiCom = node.getComponent(UITransform);
        uiCom.setContentSize(view.getVisibleSize());
        uiCom.priority = 100 - 0.01;
        node.on(Node.EventType.TOUCH_START, function (event: any) {
            event.propagationStopped = true;
        }, node);

        setTimeout(()=>{
            node.destroy();
        }, 2000)
    }
}