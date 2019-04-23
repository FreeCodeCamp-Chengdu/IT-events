import {
    makeDate,
    eventList,
    mergeStream,
    updateEvent
} from '../source/utility';

import { JSDOM } from 'jsdom';

import { spy } from 'sinon';

const list = [];

describe('Utility methods', () => {
    /**
     * @test {makeDate}
     */
    it('makes a Date object from a String', () => {
        makeDate('2019.04.22 周一').should.be.eql(new Date('2019-04-22'));

        makeDate('2019/04/22 22:22:22.000').should.be.eql(
            new Date('2019-04-22 22:22:22')
        );
    });

    /**
     * @test {eventList}
     */
    it('iterates Events from a HTML List structure', async () => {
        for await (let item of eventList(
            await JSDOM.fromFile('test/index.html', {
                url: 'https://fcc-cd.tk/activity/'
            }),
            '.content .activity-item',
            '.flex-box h4',
            '.flex-box > :last-child',
            null,
            '.image img'
        ))
            list.push(item);

        list.should.be.eql([
            {
                title: 'AI 学院工作坊 #0',
                start: '2019-04-20 14:00:00',
                banner: 'https://fcc-cd.tk/images/thumbnail.svg'
            },
            {
                title: 'NodeJS 网页爬虫一小时实战',
                start: '2019-04-14 20:00:00',
                banner: 'https://fcc-cd.tk/images/thumbnail.svg'
            },
            {
                title: '走近函数式编程',
                start: '2019-03-30 14:00:00',
                banner:
                    'https://fcc-cd.tk/activity/salon/start-functional-programming/final-all.jpg'
            },
            {
                title: '内容型网站应用一小时实战',
                start: '2019-03-24 20:00:00',
                banner: 'https://fcc-cd.tk/images/thumbnail.svg'
            },
            {
                title: 'CodingDojo 编程道场 #1',
                start: '2019-01-20 13:30:00',
                banner: 'https://fcc-cd.tk/images/thumbnail.svg'
            }
        ]);
    });

    /**
     * @test {updateEvent}
     */
    it('updates Event item', () => {
        const onUpdated = spy(),
            New = {
                title: 'NodeJS 网页爬虫一小时实战 - 水歌的 JS 工作坊',
                start: '2019-04-14 20:10:00'
            };

        updateEvent(list[1], New, onUpdated);

        onUpdated.should.be.calledWith(list[1], New);

        list[1].should.be.eql({
            title: 'NodeJS 网页爬虫一小时实战 - 水歌的 JS 工作坊',
            start: '2019-04-14 20:10:00',
            banner: 'https://fcc-cd.tk/images/thumbnail.svg'
        });

        onUpdated.should.be.calledTwice();
    });

    /**
     * @test {mergeStream}
     */
    it('merges Streams', async () => {
        async function* streamOf(list) {
            for (let item of list) yield item;
        }

        const queue = [];

        for await (let item of mergeStream(
            [streamOf([1, 3, 5, 7]), streamOf([2, 4, 6, 8])],
            undefined,
            0
        ))
            queue.push(item);

        queue.should.be.eql([1, 2, 3, 4, 5, 6, 7, 8]);
    });
});
