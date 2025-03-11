import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { Skill, SkillLevel } from '../models/skill.model';

interface TsvSkill {
    name: string;
    description: string;
    level: string;
    effect: string;
}

interface DataSkillLevel extends SkillLevel {
    level: number;
}

@Injectable({
    providedIn: 'root',
})
export class SkillTsvReaderService {
    read(tsvString: string): Promise<Skill[]> {
        return new Promise((resolve) => {
            parse<TsvSkill>(tsvString, {
                delimiter: '\t',
                header: true,
                skipEmptyLines: true,
                complete: (tsv) => {
                    const skills = tsv.data.reduce((acc, row) => {
                        if (!acc[row.name]) {
                            acc[row.name] = { name: row.name, levels: [] };
                        }
                        this.insert(
                            acc[row.name].levels as DataSkillLevel[],
                            this.mapRow(row)
                        );

                        return acc;
                    }, {} as { [key: string]: Skill });
                    resolve(Object.values(skills));
                },
            });
        });
    }

    private mapRow = (tsvRow: TsvSkill) => {
        return {
            level: Number(tsvRow.level),
            description: tsvRow.effect,
        } as DataSkillLevel;
    };

    private insert(array: DataSkillLevel[], value: DataSkillLevel) {
        let low = 0,
            high = array.length;

        while (low < high) {
            let mid = (low + high) >>> 1;
            if (array[mid].level < value.level) low = mid + 1;
            else high = mid;
        }

        array.splice(low, 0, value);
    }
}
