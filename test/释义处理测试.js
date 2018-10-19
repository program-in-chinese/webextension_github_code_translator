QUnit.test("分词性", function (assert) {
  assert.deepEqual(
    分词性("n. 种类, 方式\\nvt. 分类", 词性),
    {"n.": ["种类", "方式"], "vt.": ["分类"]},
    "");
});

QUnit.test("首选sort", function (assert) {
  assert.deepEqual(
    首选("n. 种类, 方式, 品质, 态度, 举止\\nvt. 分类, 排序, 挑选\\nvi. 交往, 协调" +
    "\\n[计] 排序; DOS外部命令:从标准输入设备接收数据, 整个数据输入完后" +
    "\\n对它以行为单位进行排序, 然后在标准输出设备上输出", 词性),
    "排序",
    "");
});

QUnit.test("取词_单个", function (assert) {
  assert.deepEqual(
    取字段中所有词("apple"),
    ["apple"],
    "");
});

QUnit.test("取词_带前后空格", function (assert) {
  assert.deepEqual(
    取字段中所有词(" apple "),
    ["apple"],
    "");
});

QUnit.test("取词_两个词", function (assert) {
  assert.deepEqual(
    取字段中所有词("apple_orange"),
    ["apple", "orange"],
    "");
});

QUnit.test("取词_两个词", function (assert) {
  assert.deepEqual(
    取字段中所有词("appleOrange"),
    ["apple", "Orange"],
    "");
});

QUnit.test("取词_多个词", function (assert) {
  assert.deepEqual(
    取字段中所有词("apple_orangePear"),
    ["apple", "orange", "Pear"],
    "");
});

QUnit.test("取词_中间带空格", function (assert) {
  assert.deepEqual(
    取字段中所有词("apple orange"),
    [],
    "");
});

QUnit.test("拆分骆驼命名_小写单词", function (assert) {
  assert.deepEqual(
    拆分骆驼命名("apple"),
    ["apple"],
    "");
});

QUnit.test("拆分骆驼命名_多个单词", function (assert) {
  assert.deepEqual(
    拆分骆驼命名("appleOrange"),
    ["apple", "Orange"],
    "");
});