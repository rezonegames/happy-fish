/* eslint-disable */

export const protobufPackage = "proto";

export enum ErrorCode {
  None = 0,
  OK = 200,
  DBError = 1,
  UnknownError = 2,
  ParameterError = 3,
  AccountIdError = 4,
  AlreadyInRoom = 5,
  TableDismissError = 6,
  RoomDismissError = 7,
  JoinError = 8,
  LeaveError = 9,
  SitDownError = 10,
  StandUpErrpr = 11,
  CreateTableError = 12,
  KickUserError = 13,
  LeaveTableError = 14,
  JoinTableError = 15,
  NotJoinRoomError = 16,
  NotJoinTableError = 17,
  RoomNotKnown = 18,
  TableNotKnown = 19,
  QuickStartError = 20,
  NeedRegisterError = 21,
  UnSupportFunc = 22,
  PasswordError = 23,
  AlreadyRegister = 24,
  UNRECOGNIZED = -1,
}
