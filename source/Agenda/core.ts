import { fromBuffer } from 'file-type';
import fetch from 'node-fetch';
import { parse } from 'path';
import { stringify } from 'yaml';

import { DataCrawler } from '../core/Crawler';
import { logTime, saveFile, stringifyCSV } from '../utility';

export type Mentor = Partial<
    Record<'name' | 'avatar' | 'position' | 'summary', string>
>;
export type During = Record<'date' | 'startTime' | 'endTime', string>;

export interface Forum extends Pick<Mentor, 'name' | 'summary'> {
    during: During;
}

export interface Agenda {
    title?: string;
    during?: During;
    mentor?: Mentor;
    forum?: Forum;
}

export abstract class AgendaCrawler<
    A extends Agenda = Agenda,
    M extends Mentor = Mentor,
    F extends Forum = Forum
> extends DataCrawler<A> {
    mentors: M[] = [];
    forums: F[] = [];

    override makeYAML(agendas: A[]) {
        return stringify({
            mentors: this.mentors,
            forums: this.forums,
            agendas
        });
    }

    makeCSV(agendas: A[]) {
        const { mentors, forums } = this;

        return {
            mentors,
            forums: forums.map(({ during, ...forum }) => ({
                ...forum,
                ...during
            })),
            agendas: agendas.map(({ during, mentor, forum, ...agenda }) => ({
                ...agenda,
                ...during,
                mentor: mentor.name,
                forum: forum.name
            }))
        };
    }

    @logTime
    async saveCSV(agendas: A[], folder: string) {
        for (const [name, rows] of Object.entries(this.makeCSV(agendas)))
            await saveFile(stringifyCSV(rows), folder, `${name}.csv`);
    }

    @logTime
    async saveImagesTo(folder: string) {
        for (const { avatar } of this.mentors)
            if (avatar) {
                const response = await fetch(avatar);
                const buffer = Buffer.from(await response.arrayBuffer());
                const { ext } = await fromBuffer(buffer);

                await saveFile(
                    buffer,
                    folder,
                    'image',
                    `${parse(avatar).name}.${ext}`
                );
            }
    }

    override async saveList(URI: string) {
        const { list, folder, file } = await super.saveList(URI);

        await this.saveCSV(list, folder);
        await this.saveImagesTo(folder);

        return { list, folder, file };
    }
}
