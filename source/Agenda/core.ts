import { stringify } from 'yaml';

import { DataCrawler } from '../core/Crawler';

export type Mentor = Partial<
    Record<'name' | 'avatar' | 'position' | 'summary', string>
>;
export type Forum = Partial<Record<'title', string>>;

export interface Agenda {
    title?: string;
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

    override makeFile(agendas: A[]) {
        return stringify({
            mentors: this.mentors,
            forums: this.forums,
            agendas
        });
    }
}
