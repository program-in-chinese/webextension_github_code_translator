var 词性_计算机 = "[计]";

function 分词性(中文释义, 所有词性) {
  var 所有释义 = 中文释义.split('\\n');
  var 词性到释义 = {};
  for (var i in 所有释义) {
    var 除去词性 = 所有释义[i];
    var 当前词性 = '';
    for (var j in 所有词性) {
      var 词性 = 所有词性[j];
      if (除去词性.indexOf(词性) == 0) {
        当前词性 = 词性;
        除去词性 = 除去词性.substring(词性.length).trim();
        break;
      }
    }
    // 按逗号分隔词义
    // TODO: 也有分号分隔
    var 词义 = 除去词性.split(/[；;,]/);
    //console.log(词义)
    var 此词性的释义 = []
    for (var 索引 in 词义) {
      此词性的释义.push(词义[索引].trim());
    }
    词性到释义[当前词性] = 此词性的释义;
  }
  return 词性到释义;
}

function 首选(中文释义, 所有词性) {
  if (!中文释义) {
    return;
  }
  var 首选词义 = "";
  var 词性到释义 = 分词性(中文释义, 所有词性);
  //console.log(词性到释义);
  if (词性到释义[词性_计算机]) {
    首选词义 = 词性到释义[词性_计算机][0];
  } else {
    // 取第一个词性的第一释义
    for (var 词性 in 词性到释义) {
      首选词义 = 词性到释义[词性][0];
      break;
    }
  }
  首选词义 = 消除所有括号内容(首选词义);
  return 首选词义;
}

function 取复数原型(词) {
  if (命名词典[词].词形) {
    var 原词 = 词;
    var 为复数形式 = false;
    for (某词形 of 命名词典[词].词形) {
      if (某词形.类型 == "原型变换形式" && 某词形.变化.includes("名词复数形式")) {
        为复数形式 = true;
      }
      if (某词形.类型 == "原型") {
        原词 = 某词形.变化;
      }
    }
    if (为复数形式) {
      return 原词;
    }
  }
  return 词;
}
