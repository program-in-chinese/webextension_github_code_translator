/* 大小写敏感
*/

var 关键词词典 = {
  'for': '对于',
  'in': '在',
  'if': '如果',
  'del': '删除'
};

var API词典 = {
  'print': '打印',
  'append': '添加',
  'sort': '排序',
  'len': '长度',
  'end': '结尾'
}

var 命名词典 = {
  'shoplist': '购物单',
  'apple': '苹果',
  'mango': '芒果',
  'carrot': '胡萝卜',
  'banana': '香蕉',
  'rice': '米',
  'item': '物品',
  'olditem': '第一项'
}

function 翻译() {
  var 原代码拷贝 = document.getElementsByTagName('table')[0];
  var span字段列表 = 原代码拷贝.getElementsByTagName('span');
  翻译字段列表(span字段列表);
  var 文本字段列表 = textNodesUnder(document);
  翻译字段列表(文本字段列表);
}

function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

// 假设每个字段除了词, 其他都是非英文字符.
function 取字段中所有词(字段) {
  var 单词 = 字段.match(/[a-zA-Z]+/g);
  if (单词) {
    return 单词;
  }
  return [字段];
}

function 翻译字段列表(字段列表) {
  for (var i = 0; i < 字段列表.length; i++) {

    var 字段 = 字段列表[i].textContent;
    var 所有单词 = 取字段中所有词(字段);
    var 所有单词有翻译 = false;
    for (var j = 0; j < 所有单词.length; j++) {
      var 单词 = 所有单词[j];
      var 对应中文词 = 关键词词典[单词] || API词典[单词] || 命名词典[单词];
      if (对应中文词) {
        if (j == 所有单词.length - 1) {
          所有单词有翻译 = true;
        }
      } else {
        break;
      }
      字段 = 字段.replace(单词, 对应中文词);
    }
    console.log(字段);
    console.log(所有单词有翻译);
    // 取巧: 仅当字段中所有词有翻译时才替换字段, 避免某些文本中出现个别可识别的单词. 今后需进行语法分析.
    if (所有单词有翻译) {
      字段列表[i].textContent = 字段;
    }
  }
}

  function modifyDOM() {
      //You can play with your DOM here or check URL against your regex
      console.log('Tab script:');
      var 代码段节点 = document.body.getElementsByTagName('table')[0].outerHTML
      console.log(代码段节点);
      return [代码段节点];
  }

  //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
  chrome.tabs.executeScript({
      code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
  }, (results) => {
      //Here we have just the innerHTML and not DOM structure
      console.log('Popup script:')
      console.log(results[0]);
      document.body.innerHTML = results[0];
      翻译();
  });