import { compareTwoStrings } from 'string-similarity';

import { Event, mergeStream, descendDate, diffEvent } from './utility';
import * as crawler from './crawler';

export default async function* updateEvents(
    store: Event[] = [],
    interval?: number
) {
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
