import { URLSearchParams } from 'url';

import { JSDOM } from 'jsdom';

import fetch from 'node-fetch';

import { event_list } from './utility';

export async function* HuoDongXing(start = 1) {
    while (true) {
        const URL = `https://www.huodongxing.com/events?${new URLSearchParams({
            orderby: 'n',
            tag: 'IT互联网',
            city: '成都',
            page: start++
        })}`;

        const data = await event_list(
            URL,
            '.search-tab-content-list-check .search-tab-content-item-mesh',
            '.item-title',
            '.date-pp',
            '.item-dress-pp',
            '.item-logo'
        );

        if ((data || '')[0]) yield { URL, data };
        else break;
    }
}

export async function* SegmentFault(start = 1) {
    while (true) {
        const URL = `https://segmentfault.com/events?${new URLSearchParams({
            city: 510100,
            page: start++
        })}`;

        const data = await event_list(
            URL,
            '.all-event-list .widget-event',
            '.title',
            '.widget-event__meta :first-child',
            '.widget-event__meta :last-child',
            '.widget-event__banner'
        );

        data.forEach(item => {
            (item.date = item.date.slice(3)),
            (item.address = item.address.slice(3));
        });

        if ((data || '')[0]) yield { URL, data };
        else break;
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

        if ((data || '')[0]) yield { URL, data };
        else break;
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

        try {
            const data = (await (await fetch(URL)).json()).resultObject
                .valueList.list;

            if ((data || '')[0]) yield { URL, data };
            else break;
        } catch (error) {
            console.warn(error.message);
            break;
        }
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

        var data = await (await fetch(URL, {
            method: 'POST',
            body
        })).text();

        data = await event_list(
            new JSDOM(data, { url: URL + '?' + body }),
            '.event-item',
            '.summary',
            '.when-where > label:first-of-type',
            '.when-where > label:last-of-type',
            '.item-banner img'
        );

        if ((data || '')[0]) yield { URL, data };
        else break;
    }
}
