
// 假设每个字段除了词, 其他都是非英文字符.
// 仅翻译无空格的片段
function 取字段中所有词(字段文本) {
  // 删去所有前后空格后再提取单词
  var 删除前后空格 = 字段文本.trim();
  // 确认无空格
  if (!删除前后空格.match(/^[^\s]+$/g)) {
    return [];
  }
  var 单词 = 删除前后空格.match(/[a-zA-Z]+/g);
  if (单词) {
    var 分词 = [];
    for (某单词 of 单词) {
      分词 = 分词.concat(拆分骆驼命名(某单词))
    }
    return 分词;
  }
  return [];
}

function 取字段中最长句(字段) {
  var 句 = 字段.match(/[a-zA-Z\s]+/g);
  if (句 && 句.length > 0) {
    return 句[0].trim();
  }
  return 字段;
}

function 拆分骆驼命名(命名) {
  // 参考: https://stackoverflow.com/a/46409373/1536803
  // Firefox仍不支持lookbehinds: https://stackoverflow.com/questions/49816707/firefox-invalid-regex-group
  // 不知为何结果中有空字符串, 暂时过滤即可
  return 命名.split(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/).filter(词 => 词);
}