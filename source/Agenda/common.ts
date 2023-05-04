import { JSDOM } from 'jsdom';
import { byteLength, countBy, walkDOM } from 'web-utility';

import { CSSSelectorPrecision, getCSSSelector, sameParentOf } from '../utility';
import { Agenda, AgendaCrawler } from './core';

export const TimePattern = /\d{1,2}\s*[:：]\s*\d{2}/;

const HeadingSelector = `h1, h2, h3, h4, h5, h6, strong, b`;

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
                    selector: getCSSSelector(
                        parentElement,
                        document.body,
                        CSSSelectorPrecision.Medium
                    )
                }
        ).filter(Boolean);

        const timeBoxCount = countBy(timeBoxes, ({ selector }) => selector);

        const [[agendaTimeSelector]] = Object.entries(timeBoxCount).sort(
            ([, a], [, b]) => b - a
        );
        const [first, second] = document.querySelectorAll(agendaTimeSelector);

        const agendaBox = sameParentOf(first, second) as Element;
        const agendaBoxSelector = getCSSSelector(
            agendaBox,
            document.body,
            CSSSelectorPrecision.High
        );

        for (let i = 0; i < agendaBox.childElementCount; i++)
            if (agendaBox.tagName.toLowerCase() === 'tbody')
                yield* this.getItems(
                    agendaBox.children[i] as HTMLTableRowElement
                );
            else
                yield await this.getItem(
                    `${agendaBoxSelector} > :nth-child(${i + 1})`
                );
        this.document = undefined;
    }

    override async getItem(selector: string): Promise<Agenda> {
        const agendaItem = this.document?.querySelector(selector);

        if (!agendaItem) return {};

        let time = '';

        const [head, body] = Array.from(walkDOM<Text>(agendaItem, 3)).reduce(
            (group, { parentElement, nodeValue }) => {
                const isHeading =
                    parentElement.matches(HeadingSelector) ||
                    !!parentElement.closest(HeadingSelector);

                if (TimePattern.test(nodeValue)) time = nodeValue.trim();
                else group[isHeading ? 0 : 1].push(nodeValue.trim());

                return group;
            },
            [[], []] as string[][]
        );
        const [startTime, endTime] = time.split(/[^\d:：]+/),
            [name, title] = head.sort((a, b) => byteLength(a) - byteLength(b)),
            [position, summary] = body.sort(
                (a, b) => byteLength(a) - byteLength(b)
            ),
            avatar =
                agendaItem.querySelector<HTMLImageElement>('img[src]')?.src;

        return {
            mentor: { name, position, avatar },
            title,
            summary,
            startTime,
            endTime
        };
    }

    protected getItems({ children }: HTMLTableRowElement): Agenda[] {
        const [time, ...agendas] = [...children];
        const [startTime, endTime] = time.textContent.trim().split(/[^\d:：]+/);

        return agendas.map(agendaItem => {
            const [name, position, title, summary] = agendaItem.textContent
                    .trim()
                    .split('\n')
                    .sort((a, b) => byteLength(a) - byteLength(b)),
                avatar =
                    agendaItem.querySelector<HTMLImageElement>('img[src]')?.src;

            return {
                mentor: { name, position, avatar },
                title,
                summary,
                startTime,
                endTime
            };
        });
    }
}
