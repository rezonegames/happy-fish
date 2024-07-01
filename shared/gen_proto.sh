#!/bin/bash

set -e -o pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# server
GO_OUT=${DIR}/../server/proto/
protoc \
  --proto_path=proto \
  --go_out=${GO_OUT} \
  proto/*.proto
if [ $? != 0 ]; then
  popd &
  exit 1
fi

# client todo: protoc-gen-ts_proto根据实际情况自己安装
JS_OUT=${DIR}/../client/assets/game/script/proto/
protoc \
  --plugin=/Users/zyh/.nvm/versions/node/v14.20.1/bin/protoc-gen-ts_proto \
  --ts_proto_opt=esModuleInterop=true \
  --ts_proto_opt=importSuffix=.js \
  --ts_proto_opt=outputPartialMethods=false \
  --ts_proto_opt=outputJsonMethods=false \
  --ts_proto_out=${JS_OUT} \
  --proto_path=proto \
  proto/*.proto
if [ $? != 0 ]; then
  popd &
  exit 1
fi
