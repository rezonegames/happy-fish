// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.19.4
// source: error.proto

package proto

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type ErrorCode int32

const (
	ErrorCode_None              ErrorCode = 0
	ErrorCode_OK                ErrorCode = 200
	ErrorCode_DBError           ErrorCode = 1
	ErrorCode_UnknownError      ErrorCode = 2
	ErrorCode_ParameterError    ErrorCode = 3
	ErrorCode_AccountIdError    ErrorCode = 4
	ErrorCode_AlreadyInRoom     ErrorCode = 5
	ErrorCode_TableDismissError ErrorCode = 6
	ErrorCode_RoomDismissError  ErrorCode = 7
	ErrorCode_JoinError         ErrorCode = 8
	ErrorCode_LeaveError        ErrorCode = 9
	ErrorCode_SitDownError      ErrorCode = 10
	ErrorCode_StandUpErrpr      ErrorCode = 11
	ErrorCode_CreateTableError  ErrorCode = 12
	ErrorCode_KickUserError     ErrorCode = 13
	ErrorCode_LeaveTableError   ErrorCode = 14
	ErrorCode_JoinTableError    ErrorCode = 15
	ErrorCode_NotJoinRoomError  ErrorCode = 16
	ErrorCode_NotJoinTableError ErrorCode = 17
	ErrorCode_RoomNotKnown      ErrorCode = 18
	ErrorCode_TableNotKnown     ErrorCode = 19
	ErrorCode_QuickStartError   ErrorCode = 20
	ErrorCode_NeedRegisterError ErrorCode = 21
	ErrorCode_UnSupportFunc     ErrorCode = 22
	ErrorCode_PasswordError     ErrorCode = 23
	ErrorCode_AlreadyRegister   ErrorCode = 24
)

// Enum value maps for ErrorCode.
var (
	ErrorCode_name = map[int32]string{
		0:   "None",
		200: "OK",
		1:   "DBError",
		2:   "UnknownError",
		3:   "ParameterError",
		4:   "AccountIdError",
		5:   "AlreadyInRoom",
		6:   "TableDismissError",
		7:   "RoomDismissError",
		8:   "JoinError",
		9:   "LeaveError",
		10:  "SitDownError",
		11:  "StandUpErrpr",
		12:  "CreateTableError",
		13:  "KickUserError",
		14:  "LeaveTableError",
		15:  "JoinTableError",
		16:  "NotJoinRoomError",
		17:  "NotJoinTableError",
		18:  "RoomNotKnown",
		19:  "TableNotKnown",
		20:  "QuickStartError",
		21:  "NeedRegisterError",
		22:  "UnSupportFunc",
		23:  "PasswordError",
		24:  "AlreadyRegister",
	}
	ErrorCode_value = map[string]int32{
		"None":              0,
		"OK":                200,
		"DBError":           1,
		"UnknownError":      2,
		"ParameterError":    3,
		"AccountIdError":    4,
		"AlreadyInRoom":     5,
		"TableDismissError": 6,
		"RoomDismissError":  7,
		"JoinError":         8,
		"LeaveError":        9,
		"SitDownError":      10,
		"StandUpErrpr":      11,
		"CreateTableError":  12,
		"KickUserError":     13,
		"LeaveTableError":   14,
		"JoinTableError":    15,
		"NotJoinRoomError":  16,
		"NotJoinTableError": 17,
		"RoomNotKnown":      18,
		"TableNotKnown":     19,
		"QuickStartError":   20,
		"NeedRegisterError": 21,
		"UnSupportFunc":     22,
		"PasswordError":     23,
		"AlreadyRegister":   24,
	}
)

func (x ErrorCode) Enum() *ErrorCode {
	p := new(ErrorCode)
	*p = x
	return p
}

func (x ErrorCode) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (ErrorCode) Descriptor() protoreflect.EnumDescriptor {
	return file_error_proto_enumTypes[0].Descriptor()
}

func (ErrorCode) Type() protoreflect.EnumType {
	return &file_error_proto_enumTypes[0]
}

func (x ErrorCode) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use ErrorCode.Descriptor instead.
func (ErrorCode) EnumDescriptor() ([]byte, []int) {
	return file_error_proto_rawDescGZIP(), []int{0}
}

var File_error_proto protoreflect.FileDescriptor

var file_error_proto_rawDesc = []byte{
	0x0a, 0x0b, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x05, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x2a, 0xf3, 0x03, 0x0a, 0x09, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x43, 0x6f,
	0x64, 0x65, 0x12, 0x08, 0x0a, 0x04, 0x4e, 0x6f, 0x6e, 0x65, 0x10, 0x00, 0x12, 0x07, 0x0a, 0x02,
	0x4f, 0x4b, 0x10, 0xc8, 0x01, 0x12, 0x0b, 0x0a, 0x07, 0x44, 0x42, 0x45, 0x72, 0x72, 0x6f, 0x72,
	0x10, 0x01, 0x12, 0x10, 0x0a, 0x0c, 0x55, 0x6e, 0x6b, 0x6e, 0x6f, 0x77, 0x6e, 0x45, 0x72, 0x72,
	0x6f, 0x72, 0x10, 0x02, 0x12, 0x12, 0x0a, 0x0e, 0x50, 0x61, 0x72, 0x61, 0x6d, 0x65, 0x74, 0x65,
	0x72, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x03, 0x12, 0x12, 0x0a, 0x0e, 0x41, 0x63, 0x63, 0x6f,
	0x75, 0x6e, 0x74, 0x49, 0x64, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x04, 0x12, 0x11, 0x0a, 0x0d,
	0x41, 0x6c, 0x72, 0x65, 0x61, 0x64, 0x79, 0x49, 0x6e, 0x52, 0x6f, 0x6f, 0x6d, 0x10, 0x05, 0x12,
	0x15, 0x0a, 0x11, 0x54, 0x61, 0x62, 0x6c, 0x65, 0x44, 0x69, 0x73, 0x6d, 0x69, 0x73, 0x73, 0x45,
	0x72, 0x72, 0x6f, 0x72, 0x10, 0x06, 0x12, 0x14, 0x0a, 0x10, 0x52, 0x6f, 0x6f, 0x6d, 0x44, 0x69,
	0x73, 0x6d, 0x69, 0x73, 0x73, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x07, 0x12, 0x0d, 0x0a, 0x09,
	0x4a, 0x6f, 0x69, 0x6e, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x08, 0x12, 0x0e, 0x0a, 0x0a, 0x4c,
	0x65, 0x61, 0x76, 0x65, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x09, 0x12, 0x10, 0x0a, 0x0c, 0x53,
	0x69, 0x74, 0x44, 0x6f, 0x77, 0x6e, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x0a, 0x12, 0x10, 0x0a,
	0x0c, 0x53, 0x74, 0x61, 0x6e, 0x64, 0x55, 0x70, 0x45, 0x72, 0x72, 0x70, 0x72, 0x10, 0x0b, 0x12,
	0x14, 0x0a, 0x10, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x54, 0x61, 0x62, 0x6c, 0x65, 0x45, 0x72,
	0x72, 0x6f, 0x72, 0x10, 0x0c, 0x12, 0x11, 0x0a, 0x0d, 0x4b, 0x69, 0x63, 0x6b, 0x55, 0x73, 0x65,
	0x72, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x0d, 0x12, 0x13, 0x0a, 0x0f, 0x4c, 0x65, 0x61, 0x76,
	0x65, 0x54, 0x61, 0x62, 0x6c, 0x65, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x0e, 0x12, 0x12, 0x0a,
	0x0e, 0x4a, 0x6f, 0x69, 0x6e, 0x54, 0x61, 0x62, 0x6c, 0x65, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10,
	0x0f, 0x12, 0x14, 0x0a, 0x10, 0x4e, 0x6f, 0x74, 0x4a, 0x6f, 0x69, 0x6e, 0x52, 0x6f, 0x6f, 0x6d,
	0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x10, 0x12, 0x15, 0x0a, 0x11, 0x4e, 0x6f, 0x74, 0x4a, 0x6f,
	0x69, 0x6e, 0x54, 0x61, 0x62, 0x6c, 0x65, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x11, 0x12, 0x10,
	0x0a, 0x0c, 0x52, 0x6f, 0x6f, 0x6d, 0x4e, 0x6f, 0x74, 0x4b, 0x6e, 0x6f, 0x77, 0x6e, 0x10, 0x12,
	0x12, 0x11, 0x0a, 0x0d, 0x54, 0x61, 0x62, 0x6c, 0x65, 0x4e, 0x6f, 0x74, 0x4b, 0x6e, 0x6f, 0x77,
	0x6e, 0x10, 0x13, 0x12, 0x13, 0x0a, 0x0f, 0x51, 0x75, 0x69, 0x63, 0x6b, 0x53, 0x74, 0x61, 0x72,
	0x74, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x14, 0x12, 0x15, 0x0a, 0x11, 0x4e, 0x65, 0x65, 0x64,
	0x52, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65, 0x72, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x15, 0x12,
	0x11, 0x0a, 0x0d, 0x55, 0x6e, 0x53, 0x75, 0x70, 0x70, 0x6f, 0x72, 0x74, 0x46, 0x75, 0x6e, 0x63,
	0x10, 0x16, 0x12, 0x11, 0x0a, 0x0d, 0x50, 0x61, 0x73, 0x73, 0x77, 0x6f, 0x72, 0x64, 0x45, 0x72,
	0x72, 0x6f, 0x72, 0x10, 0x17, 0x12, 0x13, 0x0a, 0x0f, 0x41, 0x6c, 0x72, 0x65, 0x61, 0x64, 0x79,
	0x52, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65, 0x72, 0x10, 0x18, 0x42, 0x08, 0x5a, 0x06, 0x2f, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_error_proto_rawDescOnce sync.Once
	file_error_proto_rawDescData = file_error_proto_rawDesc
)

func file_error_proto_rawDescGZIP() []byte {
	file_error_proto_rawDescOnce.Do(func() {
		file_error_proto_rawDescData = protoimpl.X.CompressGZIP(file_error_proto_rawDescData)
	})
	return file_error_proto_rawDescData
}

var file_error_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_error_proto_goTypes = []interface{}{
	(ErrorCode)(0), // 0: proto.ErrorCode
}
var file_error_proto_depIdxs = []int32{
	0, // [0:0] is the sub-list for method output_type
	0, // [0:0] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_error_proto_init() }
func file_error_proto_init() {
	if File_error_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_error_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   0,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_error_proto_goTypes,
		DependencyIndexes: file_error_proto_depIdxs,
		EnumInfos:         file_error_proto_enumTypes,
	}.Build()
	File_error_proto = out.File
	file_error_proto_rawDesc = nil
	file_error_proto_goTypes = nil
	file_error_proto_depIdxs = nil
}
