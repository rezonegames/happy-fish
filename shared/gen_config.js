const XLSX = require('xlsx');
const fs = require('fs');

const cellVal = (type, val) => {
    switch (type) {
        case 'int':
            val = parseInt(val);
            break;
        case 'string':
            val = val.toString();
            break;
        case 'object':
            val = JSON.parse(val);
            break;
    }
    return val;
};

// 读取 Excel 文件
const workbook = XLSX.readFile('config.xlsx');

// 获取第一个工作表的名称
const sheetNames = workbook.SheetNames;
for (let i = 0; i < sheetNames.length; i++) {
    const sheetName = sheetNames[i];

    // 获取第一个工作表
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表转换为 JSON 格式
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    let [result, keyType] = [[], {}];
    for (let i = 0; i < jsonData.length; i++) {
        let obj = jsonData[i];
        switch (i) {
            case 0:
                keyType = obj;
                break;
            case 1:
                break;
            default:
                for(const key in obj) {
                    obj[key] = cellVal(keyType[key], obj[key]);
                }
                result.push(obj);
        }
    }

    // 同步写入 JSON 数据到文件
    try {
        fs.writeFileSync(`../server/bin/config/${sheetName}.json`, JSON.stringify(result, null, 2));
        if(["weapon"].includes(sheetName)) {
            // 客户端需要的表同步到客户端
            fs.writeFileSync(`../client/assets/game/config/${sheetName}.json`, JSON.stringify(result, null, 2));
        }
        console.log(`数据已成功同步写入到文件 ${sheetName}`);
    } catch (err) {
        console.error(`写入文件${sheetName}失败:`, err);
    }
}