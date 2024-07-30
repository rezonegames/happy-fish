import {_decorator, Component, Sprite, SpriteAtlas, Animation, Vec3, find, tween, v3} from "cc";
import {Game} from "db://assets/game/script/game";
import {NotifyUpdateFrame} from "db://assets/game/script/proto/client";
import {ActionType} from "db://assets/game/script/proto/consts";
import Client from "db://assets/game/script/client";

const {ccclass, property} = _decorator;

@ccclass
export default class Weapon extends Component {

    level: number = 1;
    client: Client = null;
    weaponInfo = null;
    @property(Animation) anim = null;

    initWeapon(client: Client) {
        this.client = client;
        this.setWeapon(this.level);
    }

    setWeapon(level: number) {
        let weaponList = Game.config.weapon;
        this.weaponInfo = weaponList.filter(w => w.level === level);
        this.anim.play(this.weaponInfo.name);
    }

    onLevelUp() {
        if (this.level >= 7) return;
        this.level += 1;
        Game.channel.gameNotify("r.updateframe", NotifyUpdateFrame.encode({
            action: {
                key: ActionType.Weapon_LevelUp,
                valList: [this.level.toString()]
            }
        }).finish());
    }

    onLevelDown() {
        if (this.level <= 1) return;
        this.level -= 1;
        Game.channel.gameNotify("r.updateframe", NotifyUpdateFrame.encode({
            action: {
                key: ActionType.Weapon_LevelUp,
                valList: [this.level.toString()]
            }
        }).finish());
    }

    // onShot 玩家点击屏幕某个位置，射击，由服务器判定是否能发出
    onShot(pos: Vec3) {
        Game.channel.gameNotify("r.updateframe", NotifyUpdateFrame.encode({
            action: {
                key: ActionType.Shoot,
                valList: [pos.x.toString(), pos.y.toString(), this.level.toString()]
            }
        }).finish());
    }
}