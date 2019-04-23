import * as crawler from './crawler';

import { mergeStream, updateEvent } from './utility';

import { compareTwoStrings } from 'string-similarity';

export * from './utility';

export * from './crawler';

/**
 * @param {Object} A
 * @param {Object} B
 *
 * @return {Number}
 */
export function descendDate(A, B) {
    return B.start - A.start;
}

/**
 * @param {Object[]} [store=[]] - Fetched Events
 * @param {?Number}  interval   - Seconds
 *
 * @return {Object[]} Updated Events
 */
export default async function(store = [], interval) {
    store = store.filter(Boolean);

    const updated = [];

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

        if (!item) {
            store.push(event);

            updated.push(event);
        } else updateEvent(item, event, Old => updated.push(Old));
    }

    return Array.from(new Set(updated));
}
