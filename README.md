# 中国 IT 活动日历

核心创意源自 [@too][1] 的[一个想法][2]，核心代码源自 [@TechQuery][3] 的[《NodeJS 网页爬虫一小时实战》课程][4]。

[![NPM Dependency](https://david-dm.org/FreeCodeCamp-Chengdu/IT-events.svg)][5]
[![CI & CD](https://github.com/FreeCodeCamp-Chengdu/IT-events/actions/workflows/main.yml/badge.svg)][6]

[![NPM](https://nodei.co/npm/@fcc-cdc/it-events.png?downloads=true&downloadRank=true&stars=true)][7]

## 基本用法

### 活动列表

#### 命令行

```Shell
npm install @fcc-cdc/it-events -g

# 以间隔 0.5 秒的速度把所有活动下载到桌面的一个文件
it-events list -i 0.5 1> ~/Desktop/it-events.yml
```

#### Node.JS 模块

```JavaScript
import updateEvents, { descendDate } from '@fcc-cdc/it-events';

(async () => {
    const list = [];

    for await (let item of updateEvents(list, 0.5)) list.push(item);

    console.log([...new Set(list)].sort(descendDate));
})();
```

### 议程列表

#### 命令行

```shell
# 议程在首页
it-events agenda https://www.bagevent.com/event/8199059

# 议程在内页
it-events agenda https://www.bagevent.com/event/6840909/p/430761
```

#### Node.js 模块

```javascript
import { BagEventAgenda } from 'it-events';

// 议程在首页
new BagEventAgenda().saveList('https://www.bagevent.com/event/8199059');

// 议程在内页
new BagEventAgenda().saveList(
    'https://www.bagevent.com/event/6840909/p/430761'
);
```

[1]: https://github.com/too
[2]: ./Contributing.md
[3]: https://github.com/TechQuery
[4]: https://fcc-cd.dev/activity/workshop/nodejs-web-crawler/
[5]: https://david-dm.org/FreeCodeCamp-Chengdu/IT-events
[6]: https://github.com/FreeCodeCamp-Chengdu/IT-events/actions/workflows/main.yml
[7]: https://nodei.co/npm/@fcc-cdc/it-events/
