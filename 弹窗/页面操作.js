var 码云css = ["https://gitee.com/assets/application-e5df8140372297eda15f23497886ffdb.css"];

function 添加CSS(链接) {
  for (某链接 of 链接) {
    var css资源 = document.createElement("link");
    css资源.rel = "stylesheet";
    css资源.type = "text/css";
    css资源.href = 某链接;
    document.getElementsByTagName("head")[0].appendChild(css资源);
  }
}

function 添加链接元素(显示, url) {
  var 链接 = document.createElement("a");
  链接.href = url;
  链接.text = 显示;
  return 链接;
}

function 取子文本节点(元素) {
  var 节点, 所有节点 = [], 遍历 = document.createTreeWalker(元素, NodeFilter.SHOW_TEXT, null, false);
  while (节点 = 遍历.nextNode()) 所有节点.push(节点);
  return 所有节点;
}

function 取编程语言(顶节点) {
  var 节点类型 = 顶节点.classList;
  if (节点类型.length == 3 && 节点类型[2].indexOf('type-') == 0) {
    return 节点类型[2].substring(5);
  }
}

function 为码云页面(当前域名) {
  return 当前域名 == "gitee.com";
}

function 为关键词或核心API节点(节点, 当前域名) {
  return 节点.tagName == "SPAN"
    && 节点.className == (为码云页面(当前域名) ? "kd" : "pl-k");
}