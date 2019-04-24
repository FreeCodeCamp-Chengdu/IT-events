import { mergeStream, descendDate, diffEvent } from './utility';

import * as crawler from './crawler';

import { compareTwoStrings } from 'string-similarity';

/**
 * @param {Event[]} [store=[]]
 * @param {?Number} interval
 *
 * @yield {Event}
 */
export default async function* updateEvents(store = [], interval) {
    for await (let event of mergeStream(
        Object.values(crawler).map(item => item()),
        descendDate,
        interval
    )) {
        const item = store.find(
            ({ link, title }) =>
                link === event.link ||
                compareTwoStrings(title, event.title) > 0.7
        );

        if (!item) yield event;
        else if ((event = diffEvent(item, event)))
            yield Object.assign(item, event);
    }
}

export * from './utility';

export * from './crawler';

/**
 * @typedef {Object} Event
 *
 * @property {String}   title
 * @property {Date}     start
 * @property {?String}  address
 * @property {?URL}     banner
 * @property {?URL}     link
 * @property {String[]} tags
 */
