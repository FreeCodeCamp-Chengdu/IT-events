import { JSDOM } from 'jsdom';
import { walkDOM, countBy } from 'web-utility';

import { Agenda, AgendaCrawler } from './core';
import { getCSSSelector, sameParentOf } from '../utility';

export const TimePattern = /\d{1,2}\s*[:：]\s*\d{2}/;

export abstract class CommonAgendaCrawler extends AgendaCrawler {
    document?: Document;

    override async *getList(URI: string) {
        const {
            window: { document }
        } = await JSDOM.fromURL(URI);

        this.document = document;

        const timeBoxes = Array.from(
            walkDOM<Text>(document.body, 3),
            ({ nodeValue, parentElement }) =>
                TimePattern.test(nodeValue) && {
                    selector: getCSSSelector(parentElement, document.body)
                }
        ).filter(Boolean);

        const timeBoxCount = countBy(timeBoxes, ({ selector }) => selector);

        const [[agendaTimeSelector]] = Object.entries(timeBoxCount).sort(
            ([, a], [, b]) => b - a
        );
        const [first, second] = document.querySelectorAll(agendaTimeSelector);

        const agendaBox = sameParentOf(first, second) as Element;
        const agendaBoxSelector = getCSSSelector(agendaBox);

        for (let i = 0; i < agendaBox.childElementCount; i++)
            yield await this.getItem(
                `${agendaBoxSelector} > :nth-child(${i + 1})`
            );
        this.document = undefined;
    }

    override async getItem(selector: string): Promise<Agenda> {
        const agendaItem = this.document?.querySelector(selector);

        if (!agendaItem) return {};

        let time = '';

        const [title, name, position, summary] = Array.from(
            walkDOM<Text>(agendaItem, 3),
            ({ nodeValue }) => nodeValue.trim()
        ).filter(text => !TimePattern.test(text) || !(time = text));

        const [startTime, endTime] = time.split(/[^\d:：]+/),
            avatar =
                agendaItem.querySelector<HTMLImageElement>('img[src]')?.src;

        return {
            mentor: { name, position, avatar },
            title,
            startTime,
            endTime
        };
    }
}
