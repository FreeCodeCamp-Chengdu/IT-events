import { JSDOM } from 'jsdom';

import { URL } from 'url';

/**
 * @param {String} raw
 *
 * @return {?Date}
 */
export function makeDate(raw) {
    const date = new Date(
        ((raw || '') + '')
            .replace(/\s+(\d+:)/, 'T$1')
            .replace(/\.\d{3}Z?/, '')
            .replace(/[^\d\-T:]+/g, '-')
            .replace(/^-*|-*$/g, '')
    );

    if (!isNaN(+date)) return date;
}

/**
 * @param {String|JSDOM} source  - Web URL or document
 * @param {String}       list    - CSS Selector of Event container
 * @param {String}       title   - CSS Selector of Event title
 * @param {String}       start   - CSS Selector of Event start date
 * @param {?String}      address - CSS Selector of Event address
 * @param {?String}      banner  - CSS Selector of Event banner image
 * @param {?String}      link    - CSS Selector of Event URL
 * @param {?String}      tags    - CSS Selector of Event tags
 *
 * @yield {Event} Event data
 */
export async function* eventList(
    source,
    list,
    title,
    start,
    address,
    banner,
    link,
    tags
) {
    const {
        window: { location, document }
    } = typeof source === 'string' ? await JSDOM.fromURL(source) : source;

    list = document.querySelectorAll(list);

    if (!list[0]) return;

    console.warn(location + '');

    for (const item of list) {
        let data = {
                title: item.querySelector(title).textContent.trim(),
                start: item.querySelector(start).textContent.trim()
            },
            _address_,
            _banner_,
            _link_;

        if (address && (_address_ = item.querySelector(address)))
            data.address = _address_.textContent.trim();

        if (banner && (_banner_ = item.querySelector(banner))) {
            const { dataset, src } = _banner_;

            data.banner = src;

            for (const key in dataset)
                if (dataset[key].startsWith('http')) {
                    data.banner = dataset[key];
                    break;
                }
        }

        if (link && (_link_ = item.querySelector(link))) {
            data.link = new URL(_link_.href);

            Array.from(data.link.searchParams.keys()).forEach(
                key =>
                    key.startsWith('utm_') && data.link.searchParams.delete(key)
            );
        }

        if (tags)
            data.tags = Array.from(item.querySelectorAll(tags), item =>
                item.textContent.trim()
            );

        yield data;
    }
}

/**
 * @param {Event} Old
 * @param {Event} New
 *
 * @return {Object} Diff data
 */
export function diffEvent(Old, New) {
    const diff = {};

    new Set(Object.keys(Old).concat(New)).forEach(key => {
        if (['start', 'end'].includes(key)) {
            if (new Date(Old[key]) < new Date(New[key])) diff[key] = New[key];
        } else if ((Old[key] || '').length < (New[key] || '').length)
            diff[key] = New[key];
    });

    for (let key in diff) return diff;
}

/**
 * @param {Number} [seconds=0.25]
 *
 * @return {Promise}
 */
export function delay(seconds = 0.25) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/**
 * @param {Iterator[]}                    list
 * @param {function(A: *, B: *): Boolean} [sorter] - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters
 * @param {?Number}                       interval - Seconds
 *
 * @yield {*} Data from `list` of Iterators
 */
export async function* mergeStream(list, sorter, interval) {
    const wait = Array(list.length);

    while (true) {
        for (let i = 0; i < wait.length; i++)
            if (wait[i] === undefined) wait[i] = (await list[i].next()).value;

        const top = wait.filter(item => item !== undefined).sort(sorter)[0];

        if (top === undefined) break;

        wait[wait.indexOf(top)] = undefined;

        yield top;

        await delay(interval);
    }
}

/**
 * @param {Object} A
 * @param {Object} B
 *
 * @return {Number}
 */
export function descendDate(A, B) {
    return B.start - A.start;
}
