// 此文件拷贝自https://github.com/program-in-chinese/webextension_english_chinese_dictionary
// 尽量勿手动修改

const 词典路径 = '词典数据/词典'
const 词形变化 = '词典数据/词形变化'
const 文件扩展 = '.json'
var 词典文件 = {};
var 词形文件 = {};
for (var 文件序号 = 0; 文件序号 < 1; 文件序号++) {  // 16改为1
  词典文件[文件序号] = false;
}
词形文件[词形变化] = false;

var 词典数据 = {};
var 词形变化数据 = {};

function 载入部分词典(文件) {
  return function () {
    var 文件路径 = 词典路径 + 文件 + 文件扩展;
    fetch(chrome.runtime.getURL(文件路径))
      .then((响应) => 响应.json())
      .then((数据) => {
        for (var 英文 in 数据) {
          词典数据[英文] = 数据[英文];
        }
        词典文件[文件] = true;
      });
  }
}

fetch(chrome.runtime.getURL(词形变化 + 文件扩展))
  .then((响应) => 响应.json())
  .then((数据) => {
    for (var 英文 in 数据) {
      词形变化数据[英文] = 数据[英文];
    }
    词形文件[词形变化] = true;

    for (var 文件 in 词典文件) {
      载入部分词典(文件)();
    }
  });

function 已载入词典() {
  for (var 文件 in 词典文件) {
    if (!词典文件[文件]) {
      return false;
    }
  }
  return 词形文件[词形变化];
}

function 查词(英文) {
  return { "中文": 取释义(词典数据, 英文), "词形": 提取词形(词形变化数据[英文]) };
}

/**
 * 注意: 此接口为外部调用!
 * @param {*} 待查词 {词1: 默认值, 词2: 默认值}
 * @param {*} 发送者 
 * @param {*} 返回释义 {所有释义: {词1: "某词义1"}, {词2: "某词义2"}} }
 */
function 查词接口(待查词, 发送者, 返回释义) {
  for (var 英文词 in 待查词) {
    待查词[英文词] = 查词(英文词);
  }
  返回释义({ 所有释义: 待查词 });
  return true;
}

chrome.runtime.onMessageExternal.addListener(查词接口);