import { JSDOM } from 'jsdom';

import { URL } from 'url';

export function makeDate(raw) {
    const date = new Date(
        ((raw || '') + '')
            .replace(/\.\d{3}Z/, '')
            .replace(/[^\d\-T:]+/g, '-')
            .replace(/^-*|-*$/g, '')
    );

    if (!isNaN(+date)) return date;
}

export async function* event_list(
    source,
    box,
    title,
    start,
    address,
    banner,
    link
) {
    const {
        window: { location, document }
    } = typeof source === 'string' ? await JSDOM.fromURL(source) : source;

    box = document.querySelectorAll(box);

    if (!box[0]) return;

    console.warn(location + '');

    for (const item of box) {
        let image,
            { dataset, src } = item.querySelector(banner);

        for (const key in dataset)
            if (dataset[key].startsWith('http')) {
                image = dataset[key];
                break;
            }

        const URI = new URL(item.querySelector(link).href);

        Array.from(URI.searchParams.keys()).forEach(
            key => key.startsWith('utm_') && URI.searchParams.delete(key)
        );

        yield {
            title: item.querySelector(title).textContent.trim(),
            start: item.querySelector(start).textContent.trim(),
            address: item.querySelector(address).textContent.trim(),
            banner: image || src,
            link: URI + ''
        };
    }
}
