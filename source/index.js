#! /usr/bin/env node

import '@babel/polyfill';

import * as crawler from './crawler';

import { stringify } from 'yaml';

const list = [];

(async () => {
    for (const site in crawler)
        for await (const event of crawler[site]()) {
            const item = list.find(({ link }) => link === event.link);

            if (!item) list.push(event);
            else
                new Set(Object.keys(item).concat(event)).forEach(key => {
                    if (['start', 'end'].includes(key)) {
                        if (isNaN(+new Date(item.start)))
                            item.start = event.start;
                    } else if (
                        (item[key] || '').length < (event[key] || '').length
                    )
                        item[key] = event[key];
                });
        }

    console.info(stringify(list));
})();
