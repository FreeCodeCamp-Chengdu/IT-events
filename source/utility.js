import { JSDOM } from 'jsdom';

export async function event_list(source, box, title, date, address, banner) {
    const {
        window: { document }
    } = typeof source === 'string' ? await JSDOM.fromURL(source) : source;

    return [...document.querySelectorAll(box)].map(item => ({
        title: item.querySelector(title).textContent.trim(),
        date: item.querySelector(date).textContent.trim(),
        address: item.querySelector(address).textContent.trim(),
        banner: item.querySelector(banner).dataset.delay
    }));
}
