/* 尽量仅对命名进行翻译, 中间带空格的部分不翻译
*/

var 命名词典 = {};

var 字段中的词 = {};

function 添加所有待查词(字段列表) {
  for (var i = 0; i < 字段列表.length; i++) {
    var 字段文本 = 字段列表[i].textContent;
    var 字段中单词 = 取字段中所有词(字段文本);
    字段中的词[字段文本] = 字段中单词;
    for (单词 of 字段中单词) {
      // 如果非全大写, 则改为全小写(驼峰)
      if (单词 != 单词.toUpperCase()) {
        单词 = 单词.toLowerCase();
      }
      命名词典[单词] = false;
    }
  }
}

function 翻译(当前域名) {
  // TODO: 避免与`获取代码段()`重复
  var 编程语言 = "";
  var 原代码拷贝 = null;
  var 顶节点 = null;
  if (为码云页面(当前域名)) {
    原代码拷贝 = document.body.getElementsByClassName('code')[0];
  } else {
    原代码拷贝 = document.getElementsByTagName('table')[0];
    顶节点 = 原代码拷贝.parentElement;
    编程语言 = 取编程语言(顶节点);
  }
  var 文本字段列表 = 取子文本节点(document);

  var 关键词词典 = 取所有关键词(编程语言);
  添加所有待查词(文本字段列表);

  chrome.runtime.sendMessage(
    "ndifefelacmidghjaehmhicbchbidhpe",
    命名词典,
    function (返回值) {
      命名词典 = 返回值.所有释义;

      var 追查原词 = {};
      for (var 词 in 命名词典) {

        // TODO: 将词->原词缓冲到表, 避免翻译时重复检验是否有原型
        for (某词形 of 命名词典[词].词形) {
          if (某词形.类型 == "原型") {
            追查原词[某词形.变化] = false;
          }
        }

        命名词典[词] = 常用命名[词]
          ? { "中文": 常用命名[词] }
          : { "中文": 首选(命名词典[词].中文, 词性), "词形": 命名词典[词].词形 };
      }

      // TODO: 重构, 避免重复嵌套
      chrome.runtime.sendMessage(
        "ndifefelacmidghjaehmhicbchbidhpe",
        追查原词,
        function (返回值) {
          追查原词 = 返回值.所有释义;
          for (var 词 in 追查原词) {
            命名词典[词] = 常用命名[词]
              ? { "中文": 常用命名[词] }
              : { "中文": 首选(追查原词[词].中文, 词性), "词形": 追查原词[词].词形 };
          }
          翻译字段列表(文本字段列表, 关键词词典);

          if (顶节点) {
            顶节点.insertBefore(document.createTextNode("编程语言: " + 编程语言), 原代码拷贝);
          }
        });
    }
  );
}

function 翻译字段列表(字段列表, 关键词词典) {
  for (字段 of 字段列表) {
    var 字段文本 = 字段.textContent;

    var 所有单词 = 字段中的词[字段文本];
    for (单词 of 所有单词) {
      var 处理后词 = 单词;

      // TODO: 避免两次处理大小写
      if (处理后词 != 单词.toUpperCase()) {
        处理后词 = 单词.toLowerCase();
      }
      if (处理后词 in 不翻译) {
        continue;
      }
      // TODO: https://github.com/program-in-chinese/webextension_github_code_translator/issues/12
      var 对应中文词 = 关键词词典[处理后词]
        || API词典[处理后词]
        || 命名词典[取复数原型(处理后词)].中文;
      if (对应中文词) {
        字段文本 = 字段文本.replace(单词, 对应中文词);
      }
    }
    // TODO: 避免某些文本中出现个别可识别的单词. 今后需进行语法分析.
    字段.textContent = 字段文本;
  }
}

function 获取代码段() {
  var 当前域名 = window.location.host;
  console.log(当前域名);
  var 代码段节点 = 当前域名 == "gitee.com"
    ? document.body.getElementsByClassName('code')[0]
    : document.body.getElementsByTagName('table')[0]; // 默认, 适用于GitHub

  // GitHub: 父节点的class包含编程语言信息, 如class="blob-wrapper data type-python "
  return [当前域名, 代码段节点.parentElement.outerHTML];
}

// 需允许访问activeTab, 才能调用chrome.tabs.executeScript:
function 翻译代码段() {
  chrome.tabs.executeScript({
    code: '(' + 获取代码段 + ')();'
  }, (结果) => {
    // 仅有代码段的HTML码, 非DOM结构
    var 当前域名 = 结果[0][0];
    if (为码云页面(当前域名)) {
      添加CSS(码云css);
    }
    document.body.innerHTML = 结果[0][1];
    翻译(当前域名);
  });
}

翻译代码段();
