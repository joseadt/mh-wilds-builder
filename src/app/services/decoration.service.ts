import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Decoration, SlotLevel } from '../models/decoration.model';
import { GearSkill } from '../models/gear-skill.model';

interface TsvDecoration {
    id: number;
    name: string;
    slotLevel: number;
    skill: string;
}

@Injectable({
    providedIn: 'root',
})
export class DecorationService {
    private decorations!: Decoration[];

    constructor(private httpClient: HttpClient) {}

    async loadDecorations() {
        const response = await firstValueFrom(
            this.httpClient.get(environment.decorationsUrl, {
                responseType: 'text',
            })
        );

        this.decorations = await this.readTsv(response);
        return this.decorations;
    }

    get(slotLevel: number) {
        return this.decorations.filter((d) => d.slotLevel <= slotLevel);
    }

    getById(id?: number): Decoration | undefined {
        if (id == null) {
            return undefined;
        }
        return structuredClone(this.decorations?.find((d) => d.id === id));
    }

    private readTsv(response: string): Promise<Decoration[]> {
        return new Promise((resolve) => {
            parse<TsvDecoration>(response, {
                delimiter: '\t',
                header: true,
                skipEmptyLines: true,
                complete: (result) =>
                    resolve(result.data.map(this.mapTsvRow.bind(this))),
            });
        });
    }

    private mapTsvRow(tsvRow: TsvDecoration): Decoration {
        return {
            id: Number(tsvRow.id),
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
