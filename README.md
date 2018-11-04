#### 注意: 需先安装[离线英汉词典插件](https://chrome.google.com/webstore/detail/%E7%A6%BB%E7%BA%BF%E8%8B%B1%E6%B1%89%E8%AF%8D%E5%85%B8/ndifefelacmidghjaehmhicbchbidhpe?hl=en), 否则翻译无法完成!

在任何GitHub的源码网页([例如](https://github.com/shekhargulati/java8-the-missing-tutorial/blob/master/code/src/main/java/com/shekhargulati/java8_tutorial/ch01/BasicCalculator.java))或码云源码网页([例如](https://gitee.com/didispace/SpringBoot-Learning/blob/master/Chapter3-1-1/src/main/java/com/didispace/domain/User.java)), 点击工具栏按钮后, 弹窗中显示将源码的命名进行翻译后的对应代码段.

0.0.14
- 添加基本词库(三千左右), 以避免单独安装无法进行任何翻译的情况. 改进提示信息

0.0.12 & 0.0.13
- 如果翻译失败, 提示用户需安装离线英汉词典插件

0.0.11
- 提供用户选项是否翻译关键词和核心API, 默认不翻译

0.0.10
- 修正#12
- 小调整界面

0.0.9
- #17 常用命名/缩写的手工翻译 (仅前30个高频词); 部分词汇不予翻译(to, of, bean)
- #12 所有词如有原型, 则使用原型的释义, 包括第三人称, 复数等

0.0.8
- 初步支持码云代码翻译

[中文编程知乎专栏](https://zhuanlan.zhihu.com/c_140193266)相关文章:

- [在线代码离线翻译Chrome插件"一马"v0.0.8](https://zhuanlan.zhihu.com/p/48120706)
- [Chrome插件实现GitHub代码离线翻译v0.0.4](https://zhuanlan.zhihu.com/p/47215777)
- [Chrome插件实现GitHub代码翻译v0.0.3](https://zhuanlan.zhihu.com/p/47071729)
- [浏览器插件实现GitHub代码翻译原型演示](https://zhuanlan.zhihu.com/p/43304088)

生成安装包:
```
$ web-ext build --ignore-files=test 截图 图标/*.xcf --overwrite-dest
```
