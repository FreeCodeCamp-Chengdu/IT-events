#! /usr/bin/env node

import { Command, createCommand } from 'commander-jsx';
import { stringify } from 'yaml';

import updateEvents from './index';
import { Event, descendDate } from './utility';

async function fetch({ interval }: { interval: number }) {
    const list: Event[] = [];

    for await (const item of updateEvents(list, interval)) list.push(item);

    console.log(stringify([...new Set(list)].sort(descendDate)));

    process.exit();
}

Command.execute(
    <it-events
        version="0.6.0"
        options={{
            interval: {
                shortcut: 'i',
                parameters: '<number>',
                pattern: /^[\d.]+$/,
                description: 'Seconds interval while fetching'
            }
        }}
        executor={fetch}
    />,
    process.argv.slice(2)
);
