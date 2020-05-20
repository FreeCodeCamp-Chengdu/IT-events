# 中国 IT 活动日历

核心创意源自 [@too][1] 的[一个想法][2]，核心代码源自 [@TechQuery][3] 的[《NodeJS 网页爬虫一小时实战》课程][4]。

[![NPM Dependency](https://david-dm.org/FreeCodeCamp-Chengdu/IT-events.svg)][5]
[![Build Status](https://travis-ci.com/FreeCodeCamp-Chengdu/IT-events.svg?branch=master)][6]

[![NPM](https://nodei.co/npm/@fcc-cdc/it-events.png?downloads=true&downloadRank=true&stars=true)][7]

## 基本用法

### 命令行

```Shell
npm install @fcc-cdc/it-events -g

# 以间隔 0.5 秒的速度把所有活动下载到桌面的一个文件
it-events -i 0.5 1> ~/Desktop/it-events.yml
```

### Node.JS 模块

```JavaScript
import updateEvents, { descendDate } from '@fcc-cdc/it-events';

(async () => {
    const list = [];

    for await (let item of updateEvents(list, 0.5)) list.push(item);

    console.log([...new Set(list)].sort(descendDate));
})();
```

[1]: https://github.com/too
[2]: ./Contributing.md
[3]: https://github.com/TechQuery
[4]: https://fcc-cd.dev/activity/workshop/nodejs-web-crawler/
[5]: https://david-dm.org/FreeCodeCamp-Chengdu/IT-events
[6]: https://travis-ci.com/FreeCodeCamp-Chengdu/IT-events
[7]: https://nodei.co/npm/@fcc-cdc/it-events/
