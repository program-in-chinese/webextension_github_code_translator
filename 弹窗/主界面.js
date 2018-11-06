/* 尽量仅对命名进行翻译, 中间带空格的部分不翻译
*/
var 词典插件链接 = "https://addons.mozilla.org/zh-CN/firefox/addon/%E7%A6%BB%E7%BA%BF%E8%8B%B1%E6%B1%89%E8%AF%8D%E5%85%B8/";
var 离线英汉词典插件ID = "{ec1a2aa5-f416-4a31-91bd-cd154eed102a}"
var 命名词典 = {};

var 字段中的词 = {};

var 词典接口 = chrome.extension.getBackgroundPage();

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
    原代码拷贝 = document.body.getElementsByClassName('file_content')[0];
    顶节点 = document.body;
  } else {
    原代码拷贝 = document.getElementsByTagName('table')[0];
    顶节点 = 原代码拷贝.parentElement;
    编程语言 = 取编程语言(顶节点);
  }
  var 文本字段列表 = 取子文本节点(document);

  var 关键词词典 = 取所有关键词(编程语言);
  添加所有待查词(文本字段列表);

  var 不在本地词汇 = [];
  for (var 英文词 in 命名词典) {
    var 词条 = 词典接口.查词(英文词);
    if (!词条.中文 && !(英文词 in 常用命名) && !(英文词 in 关键词词典) && !(英文词 in API词典)) {
      不在本地词汇.push(英文词);
    }
    命名词典[英文词] = 词条;
  }
  不在本地词汇.sort(function (a, b) { return b.length - a.length });

  // TODO: 如果本地词库已满足查询, 不再查询外部词库
  chrome.runtime.sendMessage(
    离线英汉词典插件ID,
    命名词典,
    function (返回值) {
      if (!返回值 && 不在本地词汇.length > 0) {
        顶节点.insertBefore(添加链接元素("离线英汉词典插件", 词典插件链接), 顶节点.firstChild);
        var 文本元素 = document.createElement('span');
        文本元素.style.fontSize = "18px";
        文本元素.textContent = "未找到"
          + (不在本地词汇.length > 3 ? 不在本地词汇.slice(0, 3) + "等" : 不在本地词汇)
          + 不在本地词汇.length + "个词, 为更佳效果请安装77万词条的";
        顶节点.insertBefore(文本元素, 顶节点.firstChild);
      } else {
        命名词典 = 返回值.所有释义;
      }

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
      // 假设牛津三千词中都是原型词汇, 加入之前未查到, 原词也查不到; 如果之前都查到了, 原词不需再查.
      chrome.runtime.sendMessage(
        离线英汉词典插件ID,
        追查原词,
        function (返回值) {
          if (返回值) {
            追查原词 = 返回值.所有释义;
            for (var 词 in 追查原词) {
              命名词典[词] = 常用命名[词]
                ? { "中文": 常用命名[词] }
                : { "中文": 首选(追查原词[词].中文, 词性), "词形": 追查原词[词].词形 };
            }
          }

          chrome.storage.sync.get({
            翻译关键词: false
          }, function(结果) {
            翻译字段列表(文本字段列表, 关键词词典, 结果.翻译关键词, 当前域名);
          });

          if (!为码云页面(当前域名)) {
            顶节点.appendChild(document.createTextNode("编程语言: " + 编程语言), 原代码拷贝);
          }
        });
    }
  );
}

function 翻译字段(字段文本, 关键词词典) {
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
    var 对应中文词 = 关键词词典[处理后词]
      || API词典[处理后词]
      || 命名词典[取复数原型(处理后词)].中文;
    if (对应中文词) {
      字段文本 = 字段文本.replace(单词, 对应中文词);
    }
  }
  return 字段文本;
}

function 翻译字段列表(字段列表, 关键词词典, 翻译关键词, 当前域名) {
  for (字段 of 字段列表) {

    if (!翻译关键词 && 为关键词或核心API节点(字段.parentElement, 当前域名)) {
      continue;
    }
    // TODO: 避免某些文本中出现个别可识别的单词. 今后需进行语法分析.
    字段.textContent = 翻译字段(字段.textContent, 关键词词典);
  }
}

function 获取代码段() {
  var 当前域名 = window.location.host;
  
  // TODO: 改为querySelector
  var 代码段节点 = 当前域名 == "gitee.com"
    ? document.body.getElementsByClassName('file_content')[0]
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
