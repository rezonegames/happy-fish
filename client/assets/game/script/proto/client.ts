/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { ActionType, GameState, ItemType, RoomType, TableAction, TableState } from "./consts.js";
import { ErrorCode } from "./error.js";

export const protobufPackage = "proto";

/** Item 商品 */
export interface ItemInfo {
  key: ItemType;
  val: number;
}

/** 武器 */
export interface WeaponInfo {
  /** config */
  weaponId: number;
  name: string;
  hitRate: number;
  attackValue: number;
}

/** User 存档 */
export interface UserInfo {
  name: string;
  userId: string;
  seatId: number;
  weapon: WeaponInfo | undefined;
  itemList: ItemInfo[];
  updatedAt: number;
}

/** 房间 */
export interface RoomInfo {
  /** config */
  roomId: string;
  name: string;
  minCoin: number;
  type: RoomType;
  coinCoeff: number;
  userCount: number;
  /** other */
  tableCount: number;
}

/** bezier 曲线点 */
export interface BezierPoint {
  x: number;
  y: number;
  seconds: number;
}

export interface BezierInfo {
  bezierId: number;
  name: string;
  bezierList: BezierPoint[];
}

/** 鱼 */
export interface FishInfo {
  /** config */
  fishId: string;
  name: string;
  coin: number;
  hp: number;
  dodgeRate: number;
  defenceValue: number;
  bornTime: number;
  /** other */
  bezier: BezierInfo | undefined;
}

/** TableInfo 下发桌子信息 */
export interface TableInfo {
  tableId: string;
  tableState: TableState;
  users: { [key: string]: UserInfo };
  waiter: TableInfo_Waiter | undefined;
  res:
    | TableInfo_Res
    | undefined;
  /** 房间信息 */
  room:
    | RoomInfo
    | undefined;
  /** 随机种子 */
  randSeed: number;
  /** 是否加密 */
  hasPassword: boolean;
  /** 创建时间 */
  createTime: number;
  /** 房主 */
  owner: string;
  /** 结算本局时用的 */
  userItems: { [key: string]: OnItemChange };
}

export interface TableInfo_UsersEntry {
  key: string;
  value: UserInfo | undefined;
}

/** Waiter 桌子等待 */
export interface TableInfo_Waiter {
  readys: { [key: string]: number };
  countDown: number;
}

export interface TableInfo_Waiter_ReadysEntry {
  key: string;
  value: number;
}

/** Res 用于资源检查 */
export interface TableInfo_Res {
  users: { [key: string]: number };
  countDown: number;
}

export interface TableInfo_Res_UsersEntry {
  key: string;
  value: number;
}

export interface TableInfo_UserItemsEntry {
  key: string;
  value: OnItemChange | undefined;
}

/** Action 玩家行为 */
export interface Action {
  key: ActionType;
  valList: string[];
}

/** LoginToGame 登录 */
export interface LoginToGame {
  userId: string;
}

export interface LoginToGameResp {
  code: ErrorCode;
  user: UserInfo | undefined;
  roomId: string;
  tableId: string;
}

/** RegisterGameReq 注册 */
export interface RegisterGameReq {
  name: string;
  accountId: string;
}

export interface RegisterGameResponse {
  code: ErrorCode;
  user: UserInfo | undefined;
}

/** GetRoomList 房间列表 */
export interface GetRoomList {
}

export interface GetRoomListResp {
  code: ErrorCode;
  roomList: RoomInfo[];
}

/** GetTableList 桌子列表 */
export interface GetTableList {
  roomId: string;
  from: number;
  limit: number;
}

export interface GetTableListResp {
  code: ErrorCode;
  tableList: TableInfo[];
}

/** CreateTable 创建 */
export interface CreateTable {
  tableId: string;
  password: string;
}

export interface CreateTableResp {
  code: ErrorCode;
  table: TableInfo | undefined;
}

/** JoinTable 加入 */
export interface JoinTable {
  tableId: string;
}

export interface JoinTableResp {
  code: ErrorCode;
  table: TableInfo | undefined;
}

/** SitDown 坐下 */
export interface SitDown {
  tableId: string;
  password: string;
  seatId: number;
}

export interface SitDownResp {
  code: ErrorCode;
}

/** LeaveTable 离开 */
export interface LeaveTable {
}

export interface LeaveTableResp {
  code: ErrorCode;
}

/** StandUp 站起 */
export interface StandUp {
}

export interface StandUpResp {
  code: ErrorCode;
}

/** KickUser 踢出 */
export interface KickUser {
  userId: string;
}

export interface KickUserResp {
  code: ErrorCode;
}

/** JoinRoom 加入房间 */
export interface JoinRoom {
  roomId: string;
}

export interface JoinRoomResp {
  code: ErrorCode;
  roomInfo: RoomInfo | undefined;
}

/** LeaveRoom 离开房间 */
export interface LeaveRoom {
  roomId: string;
}

export interface LeaveRoomResp {
  code: ErrorCode;
}

export interface QuickStart {
  roomId: string;
}

export interface QuickStartResp {
  code: ErrorCode;
}

/** NotifyReady 准备 */
export interface NotifyReady {
}

/** NotifyResChange 资源加载到哪了 */
export interface NotifyResChange {
  current: number;
}

/** ResumeTable 断线重连用到 */
export interface ResumeTable {
}

export interface ResumeTableResp {
  code: ErrorCode;
}

/** UpdateFrame 客户端每个动作 */
export interface NotifyUpdateFrame {
  action: Action | undefined;
}

export interface OnTableAction {
  action: TableAction;
  /** 生鱼 */
  fishList: FishInfo[];
  /** 有玩家加入或者离开 */
  user: UserInfo | undefined;
}

/** OnGameState 在每一个步骤，下发游戏状态，客户端可根据状态切换页面 */
export interface OnGameState {
  state: GameState;
  tableInfo: TableInfo | undefined;
}

/** 玩家的每一个操作，都要上传到服务器，并广播出去 */
export interface OnFrame {
  userId: string;
  action: Action | undefined;
}

/** OnItemChange 道具变化 */
export interface OnItemChange {
  itemList: ItemInfo[];
  reason: string;
  to: number;
}

function createBaseItemInfo(): ItemInfo {
  return { key: 0, val: 0 };
}

export const ItemInfo = {
  encode(message: ItemInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).int32(message.key);
    }
    if (message.val !== 0) {
      writer.uint32(16).int32(message.val);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ItemInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseItemInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.key = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.val = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseWeaponInfo(): WeaponInfo {
  return { weaponId: 0, name: "", hitRate: 0, attackValue: 0 };
}

export const WeaponInfo = {
  encode(message: WeaponInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.weaponId !== 0) {
      writer.uint32(8).int32(message.weaponId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.hitRate !== 0) {
      writer.uint32(24).int32(message.hitRate);
    }
    if (message.attackValue !== 0) {
      writer.uint32(32).int32(message.attackValue);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WeaponInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWeaponInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.weaponId = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.hitRate = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.attackValue = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseUserInfo(): UserInfo {
  return { name: "", userId: "", seatId: 0, weapon: undefined, itemList: [], updatedAt: 0 };
}

export const UserInfo = {
  encode(message: UserInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.seatId !== 0) {
      writer.uint32(24).int32(message.seatId);
    }
    if (message.weapon !== undefined) {
      WeaponInfo.encode(message.weapon, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.itemList) {
      ItemInfo.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.updatedAt !== 0) {
      writer.uint32(800).int64(message.updatedAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.seatId = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.weapon = WeaponInfo.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.itemList.push(ItemInfo.decode(reader, reader.uint32()));
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }

          message.updatedAt = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseRoomInfo(): RoomInfo {
  return { roomId: "", name: "", minCoin: 0, type: 0, coinCoeff: 0, userCount: 0, tableCount: 0 };
}

export const RoomInfo = {
  encode(message: RoomInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.minCoin !== 0) {
      writer.uint32(32).int32(message.minCoin);
    }
    if (message.type !== 0) {
      writer.uint32(40).int32(message.type);
    }
    if (message.coinCoeff !== 0) {
      writer.uint32(48).int32(message.coinCoeff);
    }
    if (message.userCount !== 0) {
      writer.uint32(56).int64(message.userCount);
    }
    if (message.tableCount !== 0) {
      writer.uint32(800).int32(message.tableCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RoomInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoomInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.minCoin = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.coinCoeff = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.userCount = longToNumber(reader.int64() as Long);
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }

          message.tableCount = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseBezierPoint(): BezierPoint {
  return { x: 0, y: 0, seconds: 0 };
}

export const BezierPoint = {
  encode(message: BezierPoint, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.x !== 0) {
      writer.uint32(8).int32(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(16).int32(message.y);
    }
    if (message.seconds !== 0) {
      writer.uint32(24).int32(message.seconds);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BezierPoint {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBezierPoint();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.x = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.y = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.seconds = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseBezierInfo(): BezierInfo {
  return { bezierId: 0, name: "", bezierList: [] };
}

export const BezierInfo = {
  encode(message: BezierInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bezierId !== 0) {
      writer.uint32(8).int32(message.bezierId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    for (const v of message.bezierList) {
      BezierPoint.encode(v!, writer.uint32(802).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BezierInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBezierInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.bezierId = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 100:
          if (tag !== 802) {
            break;
          }

          message.bezierList.push(BezierPoint.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseFishInfo(): FishInfo {
  return { fishId: "", name: "", coin: 0, hp: 0, dodgeRate: 0, defenceValue: 0, bornTime: 0, bezier: undefined };
}

export const FishInfo = {
  encode(message: FishInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fishId !== "") {
      writer.uint32(10).string(message.fishId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.coin !== 0) {
      writer.uint32(24).int32(message.coin);
    }
    if (message.hp !== 0) {
      writer.uint32(32).int32(message.hp);
    }
    if (message.dodgeRate !== 0) {
      writer.uint32(40).int32(message.dodgeRate);
    }
    if (message.defenceValue !== 0) {
      writer.uint32(48).int32(message.defenceValue);
    }
    if (message.bornTime !== 0) {
      writer.uint32(56).int64(message.bornTime);
    }
    if (message.bezier !== undefined) {
      BezierInfo.encode(message.bezier, writer.uint32(802).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FishInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFishInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fishId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.coin = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.hp = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.dodgeRate = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.defenceValue = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.bornTime = longToNumber(reader.int64() as Long);
          continue;
        case 100:
          if (tag !== 802) {
            break;
          }

          message.bezier = BezierInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseTableInfo(): TableInfo {
  return {
    tableId: "",
    tableState: 0,
    users: {},
    waiter: undefined,
    res: undefined,
    room: undefined,
    randSeed: 0,
    hasPassword: false,
    createTime: 0,
    owner: "",
    userItems: {},
  };
}

export const TableInfo = {
  encode(message: TableInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tableId !== "") {
      writer.uint32(10).string(message.tableId);
    }
    if (message.tableState !== 0) {
      writer.uint32(16).int32(message.tableState);
    }
    Object.entries(message.users).forEach(([key, value]) => {
      TableInfo_UsersEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim();
    });
    if (message.waiter !== undefined) {
      TableInfo_Waiter.encode(message.waiter, writer.uint32(42).fork()).ldelim();
    }
    if (message.res !== undefined) {
      TableInfo_Res.encode(message.res, writer.uint32(50).fork()).ldelim();
    }
    if (message.room !== undefined) {
      RoomInfo.encode(message.room, writer.uint32(58).fork()).ldelim();
    }
    if (message.randSeed !== 0) {
      writer.uint32(64).int64(message.randSeed);
    }
    if (message.hasPassword === true) {
      writer.uint32(72).bool(message.hasPassword);
    }
    if (message.createTime !== 0) {
      writer.uint32(88).int64(message.createTime);
    }
    if (message.owner !== "") {
      writer.uint32(98).string(message.owner);
    }
    Object.entries(message.userItems).forEach(([key, value]) => {
      TableInfo_UserItemsEntry.encode({ key: key as any, value }, writer.uint32(802).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tableId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.tableState = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          const entry3 = TableInfo_UsersEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.users[entry3.key] = entry3.value;
          }
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.waiter = TableInfo_Waiter.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.res = TableInfo_Res.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.room = RoomInfo.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.randSeed = longToNumber(reader.int64() as Long);
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.hasPassword = reader.bool();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.createTime = longToNumber(reader.int64() as Long);
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.owner = reader.string();
          continue;
        case 100:
          if (tag !== 802) {
            break;
          }

          const entry100 = TableInfo_UserItemsEntry.decode(reader, reader.uint32());
          if (entry100.value !== undefined) {
            message.userItems[entry100.key] = entry100.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseTableInfo_UsersEntry(): TableInfo_UsersEntry {
  return { key: "", value: undefined };
}

export const TableInfo_UsersEntry = {
  encode(message: TableInfo_UsersEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      UserInfo.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableInfo_UsersEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableInfo_UsersEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = UserInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseTableInfo_Waiter(): TableInfo_Waiter {
  return { readys: {}, countDown: 0 };
}

export const TableInfo_Waiter = {
  encode(message: TableInfo_Waiter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.readys).forEach(([key, value]) => {
      TableInfo_Waiter_ReadysEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    if (message.countDown !== 0) {
      writer.uint32(16).int32(message.countDown);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableInfo_Waiter {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableInfo_Waiter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = TableInfo_Waiter_ReadysEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.readys[entry1.key] = entry1.value;
          }
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.countDown = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseTableInfo_Waiter_ReadysEntry(): TableInfo_Waiter_ReadysEntry {
  return { key: "", value: 0 };
}

export const TableInfo_Waiter_ReadysEntry = {
  encode(message: TableInfo_Waiter_ReadysEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int64(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableInfo_Waiter_ReadysEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableInfo_Waiter_ReadysEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseTableInfo_Res(): TableInfo_Res {
  return { users: {}, countDown: 0 };
}

export const TableInfo_Res = {
  encode(message: TableInfo_Res, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.users).forEach(([key, value]) => {
      TableInfo_Res_UsersEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    if (message.countDown !== 0) {
      writer.uint32(16).int32(message.countDown);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableInfo_Res {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableInfo_Res();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = TableInfo_Res_UsersEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.users[entry1.key] = entry1.value;
          }
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.countDown = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseTableInfo_Res_UsersEntry(): TableInfo_Res_UsersEntry {
  return { key: "", value: 0 };
}

export const TableInfo_Res_UsersEntry = {
  encode(message: TableInfo_Res_UsersEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int32(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableInfo_Res_UsersEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableInfo_Res_UsersEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseTableInfo_UserItemsEntry(): TableInfo_UserItemsEntry {
  return { key: "", value: undefined };
}

export const TableInfo_UserItemsEntry = {
  encode(message: TableInfo_UserItemsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      OnItemChange.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableInfo_UserItemsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableInfo_UserItemsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = OnItemChange.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseAction(): Action {
  return { key: 0, valList: [] };
}

export const Action = {
  encode(message: Action, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).int32(message.key);
    }
    for (const v of message.valList) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.key = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.valList.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseLoginToGame(): LoginToGame {
  return { userId: "" };
}

export const LoginToGame = {
  encode(message: LoginToGame, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginToGame {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginToGame();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseLoginToGameResp(): LoginToGameResp {
  return { code: 0, user: undefined, roomId: "", tableId: "" };
}

export const LoginToGameResp = {
  encode(message: LoginToGameResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.user !== undefined) {
      UserInfo.encode(message.user, writer.uint32(18).fork()).ldelim();
    }
    if (message.roomId !== "") {
      writer.uint32(34).string(message.roomId);
    }
    if (message.tableId !== "") {
      writer.uint32(42).string(message.tableId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginToGameResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginToGameResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.user = UserInfo.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.roomId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.tableId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseRegisterGameReq(): RegisterGameReq {
  return { name: "", accountId: "" };
}

export const RegisterGameReq = {
  encode(message: RegisterGameReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.accountId !== "") {
      writer.uint32(18).string(message.accountId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RegisterGameReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterGameReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.accountId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseRegisterGameResponse(): RegisterGameResponse {
  return { code: 0, user: undefined };
}

export const RegisterGameResponse = {
  encode(message: RegisterGameResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.user !== undefined) {
      UserInfo.encode(message.user, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RegisterGameResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterGameResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.user = UserInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseGetRoomList(): GetRoomList {
  return {};
}

export const GetRoomList = {
  encode(_: GetRoomList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRoomList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRoomList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseGetRoomListResp(): GetRoomListResp {
  return { code: 0, roomList: [] };
}

export const GetRoomListResp = {
  encode(message: GetRoomListResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    for (const v of message.roomList) {
      RoomInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRoomListResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRoomListResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.roomList.push(RoomInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseGetTableList(): GetTableList {
  return { roomId: "", from: 0, limit: 0 };
}

export const GetTableList = {
  encode(message: GetTableList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.from !== 0) {
      writer.uint32(16).int32(message.from);
    }
    if (message.limit !== 0) {
      writer.uint32(24).int32(message.limit);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTableList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTableList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.from = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.limit = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseGetTableListResp(): GetTableListResp {
  return { code: 0, tableList: [] };
}

export const GetTableListResp = {
  encode(message: GetTableListResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    for (const v of message.tableList) {
      TableInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTableListResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTableListResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tableList.push(TableInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseCreateTable(): CreateTable {
  return { tableId: "", password: "" };
}

export const CreateTable = {
  encode(message: CreateTable, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tableId !== "") {
      writer.uint32(10).string(message.tableId);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTable {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTable();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tableId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseCreateTableResp(): CreateTableResp {
  return { code: 0, table: undefined };
}

export const CreateTableResp = {
  encode(message: CreateTableResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.table !== undefined) {
      TableInfo.encode(message.table, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTableResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTableResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.table = TableInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseJoinTable(): JoinTable {
  return { tableId: "" };
}

export const JoinTable = {
  encode(message: JoinTable, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tableId !== "") {
      writer.uint32(10).string(message.tableId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinTable {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinTable();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tableId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseJoinTableResp(): JoinTableResp {
  return { code: 0, table: undefined };
}

export const JoinTableResp = {
  encode(message: JoinTableResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.table !== undefined) {
      TableInfo.encode(message.table, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinTableResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinTableResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.table = TableInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseSitDown(): SitDown {
  return { tableId: "", password: "", seatId: 0 };
}

export const SitDown = {
  encode(message: SitDown, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tableId !== "") {
      writer.uint32(10).string(message.tableId);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    if (message.seatId !== 0) {
      writer.uint32(24).int32(message.seatId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SitDown {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSitDown();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tableId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.seatId = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseSitDownResp(): SitDownResp {
  return { code: 0 };
}

export const SitDownResp = {
  encode(message: SitDownResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SitDownResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSitDownResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseLeaveTable(): LeaveTable {
  return {};
}

export const LeaveTable = {
  encode(_: LeaveTable, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveTable {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveTable();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseLeaveTableResp(): LeaveTableResp {
  return { code: 0 };
}

export const LeaveTableResp = {
  encode(message: LeaveTableResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveTableResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveTableResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseStandUp(): StandUp {
  return {};
}

export const StandUp = {
  encode(_: StandUp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StandUp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStandUp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseStandUpResp(): StandUpResp {
  return { code: 0 };
}

export const StandUpResp = {
  encode(message: StandUpResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StandUpResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStandUpResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseKickUser(): KickUser {
  return { userId: "" };
}

export const KickUser = {
  encode(message: KickUser, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KickUser {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKickUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseKickUserResp(): KickUserResp {
  return { code: 0 };
}

export const KickUserResp = {
  encode(message: KickUserResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KickUserResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKickUserResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseJoinRoom(): JoinRoom {
  return { roomId: "" };
}

export const JoinRoom = {
  encode(message: JoinRoom, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinRoom {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinRoom();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseJoinRoomResp(): JoinRoomResp {
  return { code: 0, roomInfo: undefined };
}

export const JoinRoomResp = {
  encode(message: JoinRoomResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.roomInfo !== undefined) {
      RoomInfo.encode(message.roomInfo, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinRoomResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinRoomResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.roomInfo = RoomInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseLeaveRoom(): LeaveRoom {
  return { roomId: "" };
}

export const LeaveRoom = {
  encode(message: LeaveRoom, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveRoom {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveRoom();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseLeaveRoomResp(): LeaveRoomResp {
  return { code: 0 };
}

export const LeaveRoomResp = {
  encode(message: LeaveRoomResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveRoomResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveRoomResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseQuickStart(): QuickStart {
  return { roomId: "" };
}

export const QuickStart = {
  encode(message: QuickStart, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QuickStart {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuickStart();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseQuickStartResp(): QuickStartResp {
  return { code: 0 };
}

export const QuickStartResp = {
  encode(message: QuickStartResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QuickStartResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuickStartResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseNotifyReady(): NotifyReady {
  return {};
}

export const NotifyReady = {
  encode(_: NotifyReady, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NotifyReady {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotifyReady();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseNotifyResChange(): NotifyResChange {
  return { current: 0 };
}

export const NotifyResChange = {
  encode(message: NotifyResChange, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.current !== 0) {
      writer.uint32(8).int32(message.current);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NotifyResChange {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotifyResChange();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.current = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseResumeTable(): ResumeTable {
  return {};
}

export const ResumeTable = {
  encode(_: ResumeTable, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResumeTable {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResumeTable();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseResumeTableResp(): ResumeTableResp {
  return { code: 0 };
}

export const ResumeTableResp = {
  encode(message: ResumeTableResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResumeTableResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResumeTableResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseNotifyUpdateFrame(): NotifyUpdateFrame {
  return { action: undefined };
}

export const NotifyUpdateFrame = {
  encode(message: NotifyUpdateFrame, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.action !== undefined) {
      Action.encode(message.action, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NotifyUpdateFrame {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNotifyUpdateFrame();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.action = Action.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseOnTableAction(): OnTableAction {
  return { action: 0, fishList: [], user: undefined };
}

export const OnTableAction = {
  encode(message: OnTableAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.action !== 0) {
      writer.uint32(8).int32(message.action);
    }
    for (const v of message.fishList) {
      FishInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.user !== undefined) {
      UserInfo.encode(message.user, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OnTableAction {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOnTableAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.action = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.fishList.push(FishInfo.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.user = UserInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseOnGameState(): OnGameState {
  return { state: 0, tableInfo: undefined };
}

export const OnGameState = {
  encode(message: OnGameState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.state !== 0) {
      writer.uint32(8).int32(message.state);
    }
    if (message.tableInfo !== undefined) {
      TableInfo.encode(message.tableInfo, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OnGameState {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOnGameState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tableInfo = TableInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseOnFrame(): OnFrame {
  return { userId: "", action: undefined };
}

export const OnFrame = {
  encode(message: OnFrame, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.action !== undefined) {
      Action.encode(message.action, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OnFrame {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOnFrame();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.action = Action.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseOnItemChange(): OnItemChange {
  return { itemList: [], reason: "", to: 0 };
}

export const OnItemChange = {
  encode(message: OnItemChange, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.itemList) {
      ItemInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.reason !== "") {
      writer.uint32(18).string(message.reason);
    }
    if (message.to !== 0) {
      writer.uint32(24).int64(message.to);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OnItemChange {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOnItemChange();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.itemList.push(ItemInfo.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.reason = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.to = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
