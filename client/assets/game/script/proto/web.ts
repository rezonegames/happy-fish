/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { AccountType } from "./consts.js";
import { ErrorCode } from "./error.js";

export const protobufPackage = "proto";

/** AccountLoginReq 第三方登录 */
export interface AccountLoginReq {
  partition: AccountType;
  accountId: string;
  password: string;
}

export interface AccountLoginResp {
  code: ErrorCode;
  userId: string;
  addr: string;
  name: string;
}

/** AccountRegisterReq 注册 */
export interface AccountRegisterReq {
  accountId: string;
  password: string;
}

export interface AccountRegisterResp {
  code: ErrorCode;
  addr: string;
}

function createBaseAccountLoginReq(): AccountLoginReq {
  return { partition: 0, accountId: "", password: "" };
}

export const AccountLoginReq = {
  encode(message: AccountLoginReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.partition !== 0) {
      writer.uint32(8).int32(message.partition);
    }
    if (message.accountId !== "") {
      writer.uint32(18).string(message.accountId);
    }
    if (message.password !== "") {
      writer.uint32(26).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountLoginReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountLoginReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.partition = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.accountId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
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

function createBaseAccountLoginResp(): AccountLoginResp {
  return { code: 0, userId: "", addr: "", name: "" };
}

export const AccountLoginResp = {
  encode(message: AccountLoginResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.addr !== "") {
      writer.uint32(26).string(message.addr);
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountLoginResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountLoginResp();
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

          message.userId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.addr = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.name = reader.string();
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

function createBaseAccountRegisterReq(): AccountRegisterReq {
  return { accountId: "", password: "" };
}

export const AccountRegisterReq = {
  encode(message: AccountRegisterReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountId !== "") {
      writer.uint32(18).string(message.accountId);
    }
    if (message.password !== "") {
      writer.uint32(26).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountRegisterReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountRegisterReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.accountId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
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

function createBaseAccountRegisterResp(): AccountRegisterResp {
  return { code: 0, addr: "" };
}

export const AccountRegisterResp = {
  encode(message: AccountRegisterResp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.addr !== "") {
      writer.uint32(18).string(message.addr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountRegisterResp {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountRegisterResp();
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

          message.addr = reader.string();
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
