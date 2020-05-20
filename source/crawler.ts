import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

import { Event, eventList, makeDate } from './utility';

export async function* HuoDongXing(all?: boolean) {
    for (let page = 1, empty = true; ; page++) {
        const URL =
            'https://www.huodongxing.com/eventlist?' +
            new URLSearchParams({
                orderby: 'n',
                status: all ? '' : '1',
                tag: 'IT互联网',
                city: '全部',
                page: page + ''
            });

        for await (const item of eventList(
            URL,
            '.search-tab-content-list .search-tab-content-item',
            '.item-title',
            '.item-data',
            '.item-dress',
            '.item-logo',
            '.item-title'
        )) {
            empty = false;

            const [start, end] = (item.start as string).split('-');

            yield {
                ...item,
                start: makeDate(start),
                end: makeDate(end)
            } as Event;
        }

        if (empty) break;
    }
}

export async function* SegmentFault(all?: boolean) {
    for (let page = 1, empty = true; ; page++) {
        const URL = 'https://segmentfault.com/events?page=' + page,
            now = new Date();

        for await (const item of eventList(
            URL,
            '.all-event-list .widget-event',
            '.title',
            '.widget-event__meta > :first-child',
            '.widget-event__meta > :last-child',
            '.widget-event__banner',
            '.title > a'
        )) {
            empty = false;

            const start = makeDate((item.start as string).slice(3));

            if (!all && now > start) return;

            yield {
                ...item,
                start,
                end: null,
                address: (item.address as string).slice(3)
            } as Event;
        }

        if (empty) break;
    }
}

export async function* JueJin(all?: boolean) {
    for (let page = 1; ; page++) {
        const URI =
                'https://event-storage-api-ms.juejin.im/v2/getEventList?' +
                new URLSearchParams({
                    src: 'web',
                    orderType: 'startTime',
                    pageNum: page + ''
                }),
            now = new Date();

        const { d: list } = await (await fetch(URI)).json();

        if (!list?.[0]) break;

        console.warn(URI);

        for (const {
            title,
            eventUrl,
            tagInfo,
            content,
            startTime,
            endTime,
            city,
            screenshot
        } of list) {
            const start = makeDate(startTime),
                end = makeDate(endTime);

            if (!all && now > start) return;

            yield {
                title,
                start,
                end,
                address: city,
                tags: tagInfo.map(({ title }) => title),
                summary: content,
                link: new URL(eventUrl),
                banner: new URL(screenshot)
            } as Event;
        }
    }
}

export async function* BaiGe(all?: boolean) {
    const {
        window: {
            document: { head }
        }
    } = await JSDOM.fromURL(
        'https://www.bagevent.com/eventlist.html?f=1&tag=17&r=orderByNew'
    );

    const { paramMap, imgDomain, mainDomain } = new Function(`${
        [
            ...head.querySelectorAll<HTMLScriptElement>('script:not(:empty)')
        ].find(code => /var param = \{[\s\S]+\}/.test(code.text)).text
    }
        return param;`)();

    for (let page = 1; ; page++) {
        paramMap.pagingPage = page;

        const URI = `${mainDomain}/load/loadSearchEventList.do?${new URLSearchParams(
                paramMap
            )}`,
            now = new Date();

        const { list } = (
            await (await fetch(URI)).json()
        ).resultObject.valueList;

        if (!list?.[0]) break;

        console.warn(URI);

        for (const {
            event_name,
            start_time,
            address,
            logo,
            event_id
        } of list) {
            const start = makeDate(start_time);

            if (!all && now > start) return;

            yield {
                title: event_name,
                start,
                address,
                banner: imgDomain + logo,
                link: new URL(mainDomain + '/event/' + event_id)
            } as Event;
        }
    }
}

export async function* OSChina(all?: boolean) {
    for (let page = 1, empty = true; ; page++) {
        const body = new URLSearchParams({
                tab: 'latest',
                time: 'all',
                p: page + ''
            }),
            URL = 'https://www.oschina.net/action/ajax/get_more_event_list',
            now = new Date();

        const data = await (await fetch(URL, { method: 'POST', body })).text();

        for await (const item of eventList(
            new JSDOM(data, { url: URL + '?' + body }),
            '.event-item',
            '.summary',
            '.when-where > label:first-of-type',
            '.when-where > label:last-of-type',
            '.item-banner img',
            '.item-banner > a'
        )) {
            empty = false;

            const start = makeDate(item.start as string);

            if (!all && now > start) return;

            yield { ...item, start, end: null } as Event;
        }

        if (empty) break;
    }
}
