import { JSDOM } from 'jsdom';
import 'urlpattern-polyfill';

import { textFrom, textOf } from '../core/Crawler';
import { AgendaCrawler } from './core';

export class BagEventAgenda extends AgendaCrawler {
    static baseURI = 'https://www.bagevent.com/event';

    static schema = new URLPattern(
        `${this.baseURI}/:event(\\d+){/p/:page(\\d+)}?`
    );

    override async *getList(URI: string) {
        const {
            window: { document }
        } = await JSDOM.fromURL(URI);

        this.forums = [...document.querySelectorAll('.s_li_fhc')].map(item => ({
            name: textFrom(item, '.s_li_ti .theme'),
            summary: textFrom(item, '.s_li_ti .intro'),
            ...this.getDuration(item.querySelector('.s_li_ti .time'))
        }));

        for (const item of document.querySelectorAll<HTMLElement>(
            '.li > .box.clearfix'
        )) {
            const forum = textFrom(
                item.closest('.s_li_fhc'),
                '.s_li_ti .theme'
            );
            yield {
                forum: this.forums.find(({ name }) => name === forum),
                ...(await this.getItemFrom(item))
            };
        }
    }

    getDuration(box: HTMLElement | null) {
        if (!box) return;

        const [date, startTime, _, endTime] = box.children;

        const dateText = textOf(date);

        return {
            startTime: `${dateText} ${textOf(startTime)}`,
            endTime: `${dateText} ${textOf(endTime)}`
        };
    }

    async getItemFrom(box: HTMLElement) {
        const { baseURI, schema } = this.constructor;
        const {
            pathname: {
                groups: { event }
            }
        } = schema.exec(box.baseURI);

        const ID = box
            .querySelector('.theme')
            ?.getAttribute('onclick')
            ?.match(/\d+/)?.[0];

        if (!ID) return;

        const detail = await this.getItem(`${baseURI}/${event}?aId=${ID}`),
            name = textFrom(box, '.g_na');

        let mentor = this.mentors.find(({ name: n }) => n === name);

        if (!mentor) {
            mentor = {
                ...detail.mentor,
                name,
                position: textFrom(box, '.g_gszw'),
                avatar: box
                    .querySelector('img')
                    ?.dataset.original?.split('?')[0]
            };
            this.mentors.push(mentor);
        }

        return {
            ...detail,
            ...this.getDuration(box.querySelector('.time')),
            mentor
        };
    }

    override async getItem(URI: string) {
        const {
            window: { document }
        } = await JSDOM.fromURL(URI);

        return {
            title: textFrom(document, '.sc_info .ti'),
            mentor: {
                name: textFrom(document, '.g_info .name'),
                avatar:
                    'https://img.bagevent.com' +
                    document.querySelector<HTMLImageElement>('.gu_li img')
                        ?.dataset.original,
                position: textFrom(document, '.g_gszw'),
                summary: textFrom(document, '.intro')
            }
        };
    }
}
