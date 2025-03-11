import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { GearType } from '../enums/armor-type.enum';
import { Gear } from '../models/gear.model';
import { skillsMapper, slotMapper } from '../utils/tsv.utils';

interface TsvCharm {
    id: number;
    name: string;
    skills: string;
}

interface TsvArmor {
    id: string;
    set: string;
    geartype: string;
    def: string;
    fireRes: string;
    waterRes: string;
    thunderRes: string;
    iceRes: string;
    dragonRes: string;
    piecename: string;
    slots: string;
    skills: string;
}

@Injectable({
    providedIn: 'root',
})
export class EquipmentTsvReaderService {
    readCharmTsv(tsvString: string): Promise<Gear[]> {
        return new Promise((resolve) =>
            parse<TsvCharm>(tsvString, {
                delimiter: '\t',
                skipEmptyLines: true,
                header: true,
                complete: (tsv) => resolve(tsv.data.map(this.mapCharmTsv)),
            })
        );
    }

    readArmorTsv(tsvString: string): Promise<Gear[]> {
        return new Promise((resolve) =>
            parse<TsvArmor>(tsvString, {
                delimiter: '\t',
                skipEmptyLines: true,
                header: true,
                complete: (tsv) => resolve(tsv.data.map(this.mapTsvArmor)),
            })
        );
    }

    private mapTsvArmor = (tsvRow: TsvArmor) => {
        return {
            id: Number(tsvRow.id),
            name: tsvRow.piecename,
            set: tsvRow.set,
            type: tsvRow.geartype.toUpperCase() as GearType,
            skills: skillsMapper(tsvRow.skills),
            slots: slotMapper(tsvRow.slots),
            stats: {
                defense: Number(tsvRow.def),
                fireResist: Number(tsvRow.fireRes),
                waterResist: Number(tsvRow.waterRes),
                thunderResist: Number(tsvRow.thunderRes),
                iceResist: Number(tsvRow.iceRes),
                dragonResist: Number(tsvRow.dragonRes),
            },
        };
    };

    private mapCharmTsv = (row: TsvCharm) => {
        return {
            id: row.id,
            name: row.name,
            stats: {},
            skills: skillsMapper(row.skills),
            slots: [],
            set: '',
            type: GearType.CHARM,
        };
    };
}
