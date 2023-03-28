import { outputFile } from 'fs-extra';
import { join } from 'path';
import { stringify } from 'yaml';

import { logTime } from '../utility';

export const textOf = (node?: Element | null) => node?.textContent?.trim();

export const textFrom = (root: ParentNode | null, selector: string) =>
    textOf(root?.querySelector(selector));

export abstract class DataCrawler<T> {
    abstract getList(URI: string): AsyncGenerator<T>;

    abstract getItem(URI: string): Promise<T>;

    makeFile(list: T[]) {
        return stringify(list);
    }

    @logTime
    async saveList(URI = '') {
        const list: T[] = [],
            file = join(process.cwd(), 'temp', `${new URL(URI).pathname}.yml`);

        for await (const item of this.getList(URI)) {
            console.log(item);

            list.push(item);
        }
        await outputFile(file, this.makeFile(list));

        console.log(`[save] ${file}\n`);
    }
}
