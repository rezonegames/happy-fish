import {Color, JsonAsset} from 'cc';
import {UIConf, uiManager} from "db://assets/core/ui/ui-manager";
import {DEBUG} from 'cc/env';
import {Logger} from "db://assets/core/common/logger";
import {HttpRequest} from "db://assets/core/network/http-request";
import {RandomManager} from "db://assets/core/common/random-manager";
import {StorageManager} from "db://assets/core/common/storage-manager";
import {NetManager} from "db://assets/core/network/net-manager";
import {EventMgr} from "db://assets/core/common/event-manager";
import {resLoader} from "db://assets/core/res/res-loader";
import {NetChannelManager} from "db://assets/game/script/channel";

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
    UIFishGround,
    UIToast,
}
const bundle = "game";
export let UICF: { [key: number]: UIConf } = {
    [UIID.UILogin]: {bundle, prefab: "prefab/login"},
    [UIID.UILogin_Guest]: {bundle, prefab: "prefab/login-guest", preventTouch: true},
    [UIID.UIRegister]: {bundle, prefab: "prefab/register"},
    [UIID.UIHall]: {bundle, prefab: "prefab/hall"},
    [UIID.UIFishGround]: {bundle, prefab: "prefab/fish-ground", preventTouch: true},
    [UIID.UIToast]: {bundle, prefab: "prefab/toast", preventTouch: true},
}

export class Game {
    static log = Logger;
    static http: HttpRequest;
    static random = RandomManager.instance;
    static storage: StorageManager;
    static tcp: NetManager;
    static event = EventMgr;
    static res = resLoader;
    static channel: NetChannelManager
    static config: any = {};

    static InitGame() {
        Game.log.logView("game init", "");
        Game.config.weapon = Game.res.get("/config/weapon",  JsonAsset, bundle).json;
        Game.storage = new StorageManager(); // storage
        // http连接地址
        Game.http = new HttpRequest();
        let url = "http://127.0.0.1:8000";
        // let url = "http://192.168.8.27:8000";
        if (!DEBUG) {
            url = "http://110.40.133.37:8000";
        }
        Game.http.server = url;
        // 网络管理器
        Game.tcp = new NetManager(); // tcp的上一层
        Game.channel = new NetChannelManager();
        Game.channel.gameCreate();
        // 初始化界面
        uiManager.initUIConf(UICF);
        uiManager.open(UIID.UILogin);
        Game.log.logView("game init done");
    }
}