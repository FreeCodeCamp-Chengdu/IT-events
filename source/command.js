#! /usr/bin/env node

import '@babel/polyfill';

import updateEvents from './index';

import { descendDate } from './utility';

import { stringify } from 'yaml';

(async () => {
    const list = [];

    for await (let item of updateEvents(list, process.argv[2])) list.push(item);

    console.info(
        stringify(Array.from(new Set(list).values()).sort(descendDate))
    );
})();
