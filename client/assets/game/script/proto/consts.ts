/* eslint-disable */

export const protobufPackage = "proto";

/** AccountType 该结构与consts结构一样，客户端服务器共用，只要定义就不能改变 */
export enum AccountType {
  DEVICEID = 0,
  WX = 1,
  FB = 2,
  GIT = 3,
  UNRECOGNIZED = -1,
}

/** GameState 暂时这样，以后拆出来，游戏内状态和游戏外状态 todo： */
export enum GameState {
  /** IDLE - 在房间里 */
  IDLE = 0,
  WAIT = 1,
  /** INGAME - 已分到桌子 */
  INGAME = 2,
  LOGOUT = 3,
  UNRECOGNIZED = -1,
}

/** TableState 桌子状态 */
export enum TableState {
  GAMING = 0,
  UNRECOGNIZED = -1,
}

/** TableAction 桌子的活动状态 */
export enum TableAction {
  ADD_USER = 0,
  LEAVE_USER = 1,
  BORN_FISH = 2,
  UNRECOGNIZED = -1,
}

/** RoomType 房间类型 */
export enum RoomType {
  ROOMTYPE_NONE = 0,
  NORMAL = 1,
  MATCH = 3,
  UNRECOGNIZED = -1,
}

/** ActionType 玩家操作 */
export enum ActionType {
  ACTIONTYPE_NONE = 0,
  /** Hit_Fish - 打中鱼 */
  Hit_Fish = 1,
  /** Weapon_LevelUp - 武器升级 */
  Weapon_LevelUp = 2,
  /** Skill - 使用技能 */
  Skill = 3,
  /** Shoot - 射击 */
  Shoot = 4,
  /** Kill_Fish - 打死鱼， 由服务器触发的行为 */
  Kill_Fish = 100,
  UNRECOGNIZED = -1,
}

/** ItemType 道具类型 */
export enum ItemType {
  COIN = 0,
  UNRECOGNIZED = -1,
}

/** NpcState npc状态 */
export enum NpcState {
  NPCSTATE_NONE = 0,
  ALIVE = 1,
  DIE = 2,
  UNRECOGNIZED = -1,
}
