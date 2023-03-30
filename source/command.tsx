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
    const Crawler = Object.values(Agenda).find(
        Class => Class instanceof Function && Class.schema?.exec(URI)
    ) as new (...data: any[]) => Agenda.BagEventAgenda;

    if (!Crawler) throw new URIError(`${URI} doesn't match any URL schema`);

    return new Crawler().saveList(URI);
}

Command.execute(
    <Command
        name="it-events"
        version="1.2.0"
        parameters="<command> [options]"
        description="China IT events crawler, made by https://fcc-cd.dev/"
    >
        <Command
            name="list"
            parameters="[options]"
            description="fetch Event list"
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
        <Command
            name="agenda"
            parameters="<URL>"
            description="fetch Agenda data & assets of an Event"
            executor={fetchAgendas}
        />
    </Command>,
    process.argv.slice(2)
);
