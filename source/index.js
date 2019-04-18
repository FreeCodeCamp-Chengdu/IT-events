#! /usr/bin/env node

import '@babel/polyfill';

import * as crawler from './crawler';

(async () => {
    const list = [];

    for (let site in crawler)
        for await (let { URL, data } of crawler[site]()) {
            console.warn(URL);

            list.push(...data);
        }

    console.info(JSON.stringify(list, null, 4));
})();
