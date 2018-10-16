/* 尽量仅对命名进行翻译, 中间带空格的部分不翻译
*/

var 关键词词典 = {};

function 添加所有待查词(字段列表) {
  var 单词 = 取所有单词(字段列表);
  for (var i in 单词) {
    命名词典[单词[i]] = false;
  }
}

function 取编程语言(顶节点) {
  var 节点类型 = 顶节点.classList;
  if (节点类型.length == 3 && 节点类型[2].indexOf('type-') == 0) {
    return 节点类型[2].substring(5);
  }
}

function 翻译() {
  var 原代码拷贝 = document.getElementsByTagName('table')[0];
  var 顶节点 = 原代码拷贝.parentElement;
  var 编程语言 = 取编程语言(顶节点);
  var span字段列表 = 原代码拷贝.getElementsByTagName('span');
  var 文本字段列表 = 取子文本节点(document);

  // 合并两个部分
  //添加所有待查词(span字段列表);
  添加所有待查词(文本字段列表);

  chrome.runtime.sendMessage(
    "ndifefelacmidghjaehmhicbchbidhpe",
    命名词典,
    function(返回值) {
      命名词典 = 返回值.所有释义;
      console.log(命名词典);
      翻译字段列表(span字段列表);
      翻译字段列表(文本字段列表);

      顶节点.insertBefore(document.createTextNode(编程语言), 原代码拷贝);
    }
  );
}

function 取子文本节点(el) {
  var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  while (n = walk.nextNode()) a.push(n);
  return a;
}

// 假设每个字段除了词, 其他都是非英文字符.
// 仅翻译无空格的片段
function 取字段中所有词(字段) {
  var 删除前后空格 = 字段.textContent.trim();
  // 确认无空格
  if (!删除前后空格.match(/^[^\s]+$/g)) {
    return [];
  }
  var 单词 = 删除前后空格.match(/[a-zA-Z]+/g);
  if (单词) {
    //console.log(删除前后空格);
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

// 删去所有前后空格后再提取单词
function 取所有单词(字段列表) {
  var 所有单词 = [];
  for (var i = 0; i < 字段列表.length; i++) {
    var 字段中单词 = 取字段中所有词(字段列表[i]);
    所有单词 = 所有单词.concat(字段中单词);
  }
  return 所有单词;
}

function 翻译字段列表(字段列表) {
  for (var i = 0; i < 字段列表.length; i++) {
    var 字段 = 字段列表[i].textContent;

    // TODO: 避免重复分析字段
    var 所有单词 = 取字段中所有词(字段列表[i]);
    //var 所有单词有翻译 = false;
    for (var j = 0; j < 所有单词.length; j++) {
      var 单词 = 所有单词[j];
      var 对应中文词 = 关键词词典[单词] || API词典[单词] || 命名词典[单词];
      if (对应中文词) {
        /*if (j == 所有单词.length - 1) {
          所有单词有翻译 = true;
        }*/
        字段 = 字段.replace(单词, 对应中文词);
      }/* else {
        break;
      }*/
    }
    // TODO: 避免某些文本中出现个别可识别的单词. 今后需进行语法分析.
    字段列表[i].textContent = 字段;
  }
}

function 获取代码段() {
  var 代码段节点 = document.body.getElementsByTagName('table')[0]
  // 父节点的class包含编程语言信息, 如class="blob-wrapper data type-python "
  var 代码段 = 代码段节点.parentElement.outerHTML
  //console.log(代码段节点);
  return [代码段];
}

// 需允许访问activeTab, 才能调用chrome.tabs.executeScript:
function 翻译代码段() {
chrome.tabs.executeScript({
  code: '(' + 获取代码段 + ')();' //function.toString()会返回函数内容
}, (结果) => {
  // 仅有代码段的HTML码, 非DOM结构
  document.body.innerHTML = 结果[0];
  翻译();
});
}

const 关键词词典文件 = '词典数据/关键词.json'
fetch(chrome.runtime.getURL(关键词词典文件))
  .then((响应) => 响应.json())
  .then((词典数据) => 关键词词典 = 词典数据)
  .then(翻译代码段);
