
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
    return 单词;
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
