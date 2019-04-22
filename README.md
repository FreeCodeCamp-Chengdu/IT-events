# 中国 IT 活动爬虫

核心代码源自[《NodeJS 网页爬虫一小时实战》课程](https://fcc-cd.tk/activity/workshop/nodejs-web-crawler/)

[![NPM Dependency](https://david-dm.org/FreeCodeCamp-Chengdu/IT-events.svg)](https://david-dm.org/FreeCodeCamp-Chengdu/IT-events)

## 基本用法

### 命令行

```shell
npm install https://github.com/FreeCodeCamp-Chengdu/IT-events.git -g

it-events 1> ~/Desktop/it-events.yml
```

### Node.JS 模块

```shell
npm install https://github.com/FreeCodeCamp-Chengdu/IT-events.git
```

```javascript
import '@babel/polyfill';

import updateEvents, { descendDate } from '@fcc-cdc/it-events';

updateEvents().then(list => console.info(list.sort(descendDate)));
```

## 想法

平时看到各种成都的技术活动，就把这个信息统一整理放到 google 日历里，共享出来大家可以随时关注，订阅日历或者查看我们这个网站页面的人可以随时了解有什么活动可以参加

目前日历主要通过 Google 日历完成。
参考 http://devcd.github.io/hxcd-events.html
本身 google 的日历 embed 是挺好的了，就是需要翻墙，所以现在用一个网上提供的 ical embed， 如果有大佬帮忙优化 css 和 格式等最好了。
google 的日历可以共享出来，大家都可以往上面添加和完善活动信息，需要 google 帐号哈。平时有活动也可以直接发给@too，我去整理放上去

信息上报最简单就是微信发消息和链接，人工解读 复制 粘贴。 高大上就是从 链接自动提取相关信息。目前我觉得简单的就好
收集活动信息的事情，目前我想也就是 FCC 群内的小伙伴们吧。

展示就是界面和美化，速度和访问保证就好了
目标用户就是成都地区懒得翻墙的用户，手机优先。

## 构成

如上，主要分两部分吧。

### 日历展示部分

目前就是界面美化和免翻墙的需求

### 活动信息收集整理

-   人工发送和整理
-   自动处理活动页面信息
-   自动添加有标准日历格式的活动信息
-   聊天机器人辅助的活动信息提取（或者可以上机器学习？）
    写一个文本解析的接口，平时把活动信息一复制然后粘贴提交，后台正则或者文本匹配解析出时间地点详情往日历里加

## 部署

先挂靠在 fcc 成都域名下？直接用 github pages 访问或者 coding.net 的 pages

## 注意事项

-   现有的 FCC 成都社区官网上有活动栏目[活动时空 - FCC 成都社区](https://fcc-cd.tk/activity/)展示社区的活动安排和过往活动，如何整合？
-   微软 Office 365 日历也可以对外共享https://sg.godaddy.com/zh/help/office-365outlook-24688
