import { JSDOM } from 'jsdom';

import { makeDate, eventList, mergeStream, diffEvent } from '../source/utility';

const list = [];

describe('Utility methods', () => {
    /**
     * @test {makeDate}
     */
    it('makes a Date object from a String', () => {
        expect(makeDate('2019.04.22 周一')).toEqual(new Date('2019-04-22'));

        expect(makeDate('2019/04/22 22:22:22.000')).toEqual(
            new Date('2019-04-22 22:22:22')
        );
    });
    /**
     * @test {eventList}
     */
    it('iterates Events from a HTML List structure', async () => {
        for await (const item of eventList(
            await JSDOM.fromFile('test/index.html', {
                url: 'https://fcc-cd.dev/activity/'
            }),
            '.content .activity-item',
            '.flex-box h4',
            '.flex-box > :last-child',
            null,
            '.image img'
        ))
            list.push(item);

        expect(list).toEqual([
            {
                title: 'AI 学院工作坊 #0',
                start: '2019-04-20 14:00:00',
                banner: new URL('https://fcc-cd.dev/images/thumbnail.svg')
            },
            {
                title: 'NodeJS 网页爬虫一小时实战',
                start: '2019-04-14 20:00:00',
                banner: new URL('https://fcc-cd.dev/images/thumbnail.svg')
            },
            {
                title: '走近函数式编程',
                start: '2019-03-30 14:00:00',
                banner: new URL(
                    'https://fcc-cd.dev/activity/salon/start-functional-programming/final-all.jpg'
                )
            },
            {
                title: '内容型网站应用一小时实战',
                start: '2019-03-24 20:00:00',
                banner: new URL('https://fcc-cd.dev/images/thumbnail.svg')
            },
            {
                title: 'CodingDojo 编程道场 #1',
                start: '2019-01-20 13:30:00',
                banner: new URL('https://fcc-cd.dev/images/thumbnail.svg')
            }
        ]);
    });
    /**
     * @test {diffEvent}
     */
    it('updates Event item', () => {
        const New = {
            title: 'NodeJS 网页爬虫一小时实战 - 水歌的 JS 工作坊',
            start: new Date('2019-04-14 20:10:00')
        };
        expect(diffEvent(list[1], New)).toMatchObject(New);
    });
    /**
     * @test {mergeStream}
     */
    it('merges Streams', async () => {
        async function* streamOf<T>(list: T[]) {
            for (const item of list)
                yield await new Promise(resolve =>
                    setTimeout(() => resolve(item))
                );
        }
        const queue = [];

        for await (const item of mergeStream(
            [streamOf([1, 3, 5, 7]), streamOf([2, 4, 6, 8])],
            undefined,
            0
        ))
            queue.push(item);

        expect(queue).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6, 7, 8]));
    });
});
