#! /usr/bin/env node

import { Command, createCommand } from 'commander-jsx';
import { stringify } from 'yaml';

import updateEvents from './index';
import { Event, descendDate } from './utility';
import * as Agenda from './Agenda';

async function fetchEvents({ interval }: { interval: number }) {
    const list: Event[] = [];

    for await (const item of updateEvents(list, interval)) list.push(item);

    console.log(stringify([...new Set(list)].sort(descendDate)));

    process.exit();
}

function fetchAgendas(_, URI: string) {
    const [vendor] = new URL(URI).hostname.split('.').slice(-2);

    const Crawler = Object.entries(Agenda).find(([name]) =>
        name.toLowerCase().match(vendor.toLowerCase())
    )?.[1] as new (...data: any[]) => Agenda.BagEventAgenda;

    return new Crawler().saveList(URI);
}

Command.execute(
    <Command name="it-events" version="1.2.0">
        <Command
            name="list"
            options={{
                interval: {
                    shortcut: 'i',
                    parameters: '<number>',
                    pattern: /^[\d.]+$/,
                    description: 'Seconds interval while fetching'
                }
            }}
            executor={fetchEvents}
        />
        <Command name="agenda" executor={fetchAgendas} />
    </Command>,
    process.argv.slice(2)
);
