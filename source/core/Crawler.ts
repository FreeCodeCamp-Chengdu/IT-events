import { join } from 'path';
import { stringify } from 'yaml';

import { logTime, saveFile } from '../utility';

export const textOf = (node?: Element | null) => node?.textContent?.trim();

export const textFrom = (root: ParentNode | null, selector: string) =>
    textOf(root?.querySelector(selector));

export abstract class DataCrawler<T> {
    declare ['constructor']: typeof DataCrawler;

    static baseURI = '';
    static schema: URLPattern;

    abstract getList(URI: string): AsyncGenerator<T>;

    abstract getItem(URI: string): Promise<T>;

    makeYAML(list: T[]) {
        return stringify(list);
    }

    @logTime
    async saveList(URI: string) {
        const list: T[] = [],
            folder = join(process.cwd(), 'temp', new URL(URI).pathname);

        for await (const item of this.getList(URI)) {
            console.log(item);

            list.push(item);
        }
        const file = await saveFile(this.makeYAML(list), folder, 'index.yml');

        return { list, folder, file };
    }
}
