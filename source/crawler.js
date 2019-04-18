import { URLSearchParams } from 'url';

import { JSDOM } from 'jsdom';

import fetch from 'node-fetch';

import { event_list } from './utility';

export async function* HuoDongXing(start = 1) {
    while (true) {
        let URL = `https://www.huodongxing.com/events?${new URLSearchParams({
                orderby: 'n',
                tag: 'IT互联网',
                city: '成都',
                page: start++
            })}`,
            empty = true;

        for await (const item of event_list(
            URL,
            '.search-tab-content-list-check .search-tab-content-item-mesh',
            '.item-title',
            '.date-pp',
            '.item-dress-pp',
            '.item-logo',
            '.search-tab-content-item-mesh > a'
        )) {
            empty = false;

            yield item;
        }

        if (empty) break;
    }
}

export async function* SegmentFault(start = 1) {
    while (true) {
        let URL = `https://segmentfault.com/events?${new URLSearchParams({
                city: 510100,
                page: start++
            })}`,
            empty = true;

        for await (const item of event_list(
            URL,
            '.all-event-list .widget-event',
            '.title',
            '.widget-event__meta > :first-child',
            '.widget-event__meta > :last-child',
            '.widget-event__banner',
            '.title > a'
        )) {
            empty = false;

            (item.start = item.start.slice(3)),
            (item.address = item.address.slice(3));

            yield item;
        }

        if (empty) break;
    }
}

export async function* JueJin(start = 1) {
    while (true) {
        const URL = `https://event-storage-api-ms.juejin.im/v2/getEventList?${new URLSearchParams(
            {
                src: 'web',
                orderType: 'startTime',
                cityAlias: 'chengdu',
                pageNum: start++
            }
        )}`;

        const data = (await (await fetch(URL)).json()).d;

        if (!(data || '')[0]) break;

        console.warn(URL);

        for (const {
            title,
            eventUrl,
            tagInfo,
            content,
            startTime,
            endTime,
            city,
            screenshot
        } of data)
            yield {
                title,
                start: startTime,
                end: endTime,
                address: city,
                tags: tagInfo.map(({ title }) => title),
                summary: content,
                link: eventUrl,
                banner: screenshot
            };
    }
}

export async function* BaiGe(start = 1) {
    while (true) {
        const URL = `https://www.bagevent.com/load/loadSearchEventList.do?${new URLSearchParams(
            {
                orderByNormal: 1,
                city: '成都',
                tag: 17,
                pagingPage: start++
            }
        )}`;

        const data = (await (await fetch(URL)).json()).resultObject.valueList
            .list;

        if (!(data || '')[0]) break;

        console.warn(URL);

        for (const { event_name, start_time, address, logo } of data)
            yield {
                title: event_name,
                start: start_time,
                address,
                banner: 'https://www.bagevent.com' + logo
            };
    }
}

export async function* OSChina(start = 1) {
    while (true) {
        const body = new URLSearchParams({
                tab: 'latest',
                time: 'all',
                city: '成都',
                p: start++
            }),
            URL = 'https://www.oschina.net/action/ajax/get_more_event_list';

        let data = await (await fetch(URL, {
                method: 'POST',
                body
            })).text(),
            empty = true;

        for await (const item of event_list(
            new JSDOM(data, { url: URL + '?' + body }),
            '.event-item',
            '.summary',
            '.when-where > label:first-of-type',
            '.when-where > label:last-of-type',
            '.item-banner img',
            '.item-banner > a'
        )) {
            empty = false;

            yield item;
        }

        if (empty) break;
    }
}
