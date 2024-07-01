// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.19.4
// source: web.proto

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

// AccountLoginReq 第三方登录
type AccountLoginReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Partition AccountType `protobuf:"varint,1,opt,name=partition,proto3,enum=proto.AccountType" json:"partition,omitempty"`
	AccountId string      `protobuf:"bytes,2,opt,name=accountId,proto3" json:"accountId,omitempty"`
	Password  string      `protobuf:"bytes,3,opt,name=password,proto3" json:"password,omitempty"`
}

func (x *AccountLoginReq) Reset() {
	*x = AccountLoginReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_web_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AccountLoginReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AccountLoginReq) ProtoMessage() {}

func (x *AccountLoginReq) ProtoReflect() protoreflect.Message {
	mi := &file_web_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AccountLoginReq.ProtoReflect.Descriptor instead.
func (*AccountLoginReq) Descriptor() ([]byte, []int) {
	return file_web_proto_rawDescGZIP(), []int{0}
}

func (x *AccountLoginReq) GetPartition() AccountType {
	if x != nil {
		return x.Partition
	}
	return AccountType_DEVICEID
}

func (x *AccountLoginReq) GetAccountId() string {
	if x != nil {
		return x.AccountId
	}
	return ""
}

func (x *AccountLoginReq) GetPassword() string {
	if x != nil {
		return x.Password
	}
	return ""
}

type AccountLoginResp struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Code   ErrorCode `protobuf:"varint,1,opt,name=code,proto3,enum=proto.ErrorCode" json:"code,omitempty"`
	UserId string    `protobuf:"bytes,2,opt,name=userId,proto3" json:"userId,omitempty"`
	Addr   string    `protobuf:"bytes,3,opt,name=addr,proto3" json:"addr,omitempty"`
	Name   string    `protobuf:"bytes,4,opt,name=name,proto3" json:"name,omitempty"`
}

func (x *AccountLoginResp) Reset() {
	*x = AccountLoginResp{}
	if protoimpl.UnsafeEnabled {
		mi := &file_web_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AccountLoginResp) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AccountLoginResp) ProtoMessage() {}

func (x *AccountLoginResp) ProtoReflect() protoreflect.Message {
	mi := &file_web_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AccountLoginResp.ProtoReflect.Descriptor instead.
func (*AccountLoginResp) Descriptor() ([]byte, []int) {
	return file_web_proto_rawDescGZIP(), []int{1}
}

func (x *AccountLoginResp) GetCode() ErrorCode {
	if x != nil {
		return x.Code
	}
	return ErrorCode_None
}

func (x *AccountLoginResp) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

func (x *AccountLoginResp) GetAddr() string {
	if x != nil {
		return x.Addr
	}
	return ""
}

func (x *AccountLoginResp) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

// AccountRegisterReq 注册
type AccountRegisterReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	AccountId string `protobuf:"bytes,2,opt,name=accountId,proto3" json:"accountId,omitempty"`
	Password  string `protobuf:"bytes,3,opt,name=password,proto3" json:"password,omitempty"`
}

func (x *AccountRegisterReq) Reset() {
	*x = AccountRegisterReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_web_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AccountRegisterReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AccountRegisterReq) ProtoMessage() {}

func (x *AccountRegisterReq) ProtoReflect() protoreflect.Message {
	mi := &file_web_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AccountRegisterReq.ProtoReflect.Descriptor instead.
func (*AccountRegisterReq) Descriptor() ([]byte, []int) {
	return file_web_proto_rawDescGZIP(), []int{2}
}

func (x *AccountRegisterReq) GetAccountId() string {
	if x != nil {
		return x.AccountId
	}
	return ""
}

func (x *AccountRegisterReq) GetPassword() string {
	if x != nil {
		return x.Password
	}
	return ""
}

type AccountRegisterResp struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Code ErrorCode `protobuf:"varint,1,opt,name=code,proto3,enum=proto.ErrorCode" json:"code,omitempty"`
	Addr string    `protobuf:"bytes,2,opt,name=addr,proto3" json:"addr,omitempty"`
}

func (x *AccountRegisterResp) Reset() {
	*x = AccountRegisterResp{}
	if protoimpl.UnsafeEnabled {
		mi := &file_web_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AccountRegisterResp) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AccountRegisterResp) ProtoMessage() {}

func (x *AccountRegisterResp) ProtoReflect() protoreflect.Message {
	mi := &file_web_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AccountRegisterResp.ProtoReflect.Descriptor instead.
func (*AccountRegisterResp) Descriptor() ([]byte, []int) {
	return file_web_proto_rawDescGZIP(), []int{3}
}

func (x *AccountRegisterResp) GetCode() ErrorCode {
	if x != nil {
		return x.Code
	}
	return ErrorCode_None
}

func (x *AccountRegisterResp) GetAddr() string {
	if x != nil {
		return x.Addr
	}
	return ""
}

var File_web_proto protoreflect.FileDescriptor

var file_web_proto_rawDesc = []byte{
	0x0a, 0x09, 0x77, 0x65, 0x62, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x05, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x1a, 0x0b, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a,
	0x0c, 0x63, 0x6f, 0x6e, 0x73, 0x74, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x7d, 0x0a,
	0x0f, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x4c, 0x6f, 0x67, 0x69, 0x6e, 0x52, 0x65, 0x71,
	0x12, 0x30, 0x0a, 0x09, 0x70, 0x61, 0x72, 0x74, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x0e, 0x32, 0x12, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2e, 0x41, 0x63, 0x63, 0x6f,
	0x75, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x52, 0x09, 0x70, 0x61, 0x72, 0x74, 0x69, 0x74, 0x69,
	0x6f, 0x6e, 0x12, 0x1c, 0x0a, 0x09, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x49, 0x64, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x49, 0x64,
	0x12, 0x1a, 0x0a, 0x08, 0x70, 0x61, 0x73, 0x73, 0x77, 0x6f, 0x72, 0x64, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x08, 0x70, 0x61, 0x73, 0x73, 0x77, 0x6f, 0x72, 0x64, 0x22, 0x78, 0x0a, 0x10,
	0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x4c, 0x6f, 0x67, 0x69, 0x6e, 0x52, 0x65, 0x73, 0x70,
	0x12, 0x24, 0x0a, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x10,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2e, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x43, 0x6f, 0x64, 0x65,
	0x52, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64,
	0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x12, 0x12,
	0x0a, 0x04, 0x61, 0x64, 0x64, 0x72, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x61, 0x64,
	0x64, 0x72, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x4e, 0x0a, 0x12, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e,
	0x74, 0x52, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65, 0x72, 0x52, 0x65, 0x71, 0x12, 0x1c, 0x0a, 0x09,
	0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x49, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x09, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08, 0x70, 0x61,
	0x73, 0x73, 0x77, 0x6f, 0x72, 0x64, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x70, 0x61,
	0x73, 0x73, 0x77, 0x6f, 0x72, 0x64, 0x22, 0x4f, 0x0a, 0x13, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e,
	0x74, 0x52, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70, 0x12, 0x24, 0x0a,
	0x04, 0x63, 0x6f, 0x64, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x10, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x2e, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x43, 0x6f, 0x64, 0x65, 0x52, 0x04, 0x63,
	0x6f, 0x64, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x61, 0x64, 0x64, 0x72, 0x18, 0x02, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x04, 0x61, 0x64, 0x64, 0x72, 0x42, 0x08, 0x5a, 0x06, 0x2f, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_web_proto_rawDescOnce sync.Once
	file_web_proto_rawDescData = file_web_proto_rawDesc
)

func file_web_proto_rawDescGZIP() []byte {
	file_web_proto_rawDescOnce.Do(func() {
		file_web_proto_rawDescData = protoimpl.X.CompressGZIP(file_web_proto_rawDescData)
	})
	return file_web_proto_rawDescData
}

var file_web_proto_msgTypes = make([]protoimpl.MessageInfo, 4)
var file_web_proto_goTypes = []interface{}{
	(*AccountLoginReq)(nil),     // 0: proto.AccountLoginReq
	(*AccountLoginResp)(nil),    // 1: proto.AccountLoginResp
	(*AccountRegisterReq)(nil),  // 2: proto.AccountRegisterReq
	(*AccountRegisterResp)(nil), // 3: proto.AccountRegisterResp
	(AccountType)(0),            // 4: proto.AccountType
	(ErrorCode)(0),              // 5: proto.ErrorCode
}
var file_web_proto_depIdxs = []int32{
	4, // 0: proto.AccountLoginReq.partition:type_name -> proto.AccountType
	5, // 1: proto.AccountLoginResp.code:type_name -> proto.ErrorCode
	5, // 2: proto.AccountRegisterResp.code:type_name -> proto.ErrorCode
	3, // [3:3] is the sub-list for method output_type
	3, // [3:3] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_web_proto_init() }
func file_web_proto_init() {
	if File_web_proto != nil {
		return
	}
	file_error_proto_init()
	file_consts_proto_init()
	if !protoimpl.UnsafeEnabled {
		file_web_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AccountLoginReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_web_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AccountLoginResp); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_web_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AccountRegisterReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_web_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AccountRegisterResp); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_web_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   4,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_web_proto_goTypes,
		DependencyIndexes: file_web_proto_depIdxs,
		MessageInfos:      file_web_proto_msgTypes,
	}.Build()
	File_web_proto = out.File
	file_web_proto_rawDesc = nil
	file_web_proto_goTypes = nil
	file_web_proto_depIdxs = nil
}
