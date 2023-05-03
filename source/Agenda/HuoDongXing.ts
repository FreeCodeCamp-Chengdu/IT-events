import { CommonAgendaCrawler } from './common';

export class HuoDongXingAgenda extends CommonAgendaCrawler {
    static baseURI = 'https://www.huodongxing.com/event';

    static schema = new URLPattern(`${this.baseURI}/:event(\\d+)`);
}
