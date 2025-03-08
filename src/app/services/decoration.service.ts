import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { environment } from '../../environments/environment';
import { Decoration, SlotLevel } from '../models/decoration.model';
import { GearSkill } from '../models/gear-skill.model';

interface TsvDecoration {
    name: string;
    slotLevel: string;
    skill: string;
}

@Injectable({
    providedIn: 'root',
})
export class DecorationService {
    private decorations!: Decoration[];

    constructor(private httpClient: HttpClient) {}

    loadDecorations() {
        if (environment.tsv) {
            this.httpClient
                .get(environment.decorationsUrl, { responseType: 'text' })
                .subscribe(this.readTsv);
            return;
        }
        this.httpClient
            .get<Decoration[]>(environment.baseUrl + 'decorations.json')
            .subscribe((result) => (this.decorations = result));
    }

    get(slotLevel: number) {
        return this.decorations.filter((d) => d.slotLevel <= slotLevel);
    }

    private readTsv = (response: string) => {
        console.log(response);
        parse<TsvDecoration>(response, {
            delimiter: '\t',
            header: true,
            skipEmptyLines: true,
            complete: (result) =>
                (this.decorations = result.data.map(this.mapTsvRow.bind(this))),
        });
    };

    private mapTsvRow(tsvRow: TsvDecoration): Decoration {
        console.log(tsvRow);
        return {
            color: '#ffffff',
            name: tsvRow.name,
            slotLevel: Number(tsvRow.slotLevel) as SlotLevel,
            skills: tsvRow.skill.split(',').map(this.mapTsvSkill),
        };
    }

    private mapTsvSkill(skillString: string): GearSkill {
        const skill = skillString.split('+');

        return { name: skill[0], level: Number(skill[1]) };
    }
}
