import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { GearType, WeaponType } from '../enums/armor-type.enum';
import { Weapon } from '../models/gear.model';
import { skillsMapper, slotMapper } from '../utils/tsv.utils';

interface TsvWeapon {
    id: string;
    name: string;
    damage: string;
    affinity: string;
    element: string;
    skills: string;
    slots: string;
}

@Injectable({
    providedIn: 'root',
})
export class WeaponTsvReaderService {
    readTsv(tsvString: string, weaponType: WeaponType): Promise<Weapon[]> {
        return new Promise((resolve) => {
            parse<TsvWeapon>(tsvString, {
                delimiter: '\t',
                header: true,
                skipEmptyLines: true,
                complete: (parsedTsv) => {
                    resolve(
                        parsedTsv.data.map((row) =>
                            this.tsvToWeapon(row, weaponType)
                        )
                    );
                },
            });
        });
    }

    private tsvToWeapon(tsvRow: TsvWeapon, weaponType: WeaponType): Weapon {
        const weapon: Weapon = {
            set: '',
            id: Number(tsvRow.id),
            type: GearType.WEAPON,
            name: tsvRow.name,
            weaponType,
            stats: {},
            slots: slotMapper(tsvRow.slots),
            skills: skillsMapper(tsvRow.skills),
        };

        weapon.id = Number(tsvRow.id);
        weapon.stats!.attack = Number(tsvRow.damage);

        const bonus = tsvRow.affinity?.split(',');
        if (!isNaN(bonus?.[0] as any)) {
            weapon.stats!.affinity = Number(bonus[0]);
        }

        if (bonus?.[1]) {
            weapon.stats!.defense = Number(
                bonus[1].toLowerCase().replace('def', '')
            );
        }

        const element = tsvRow.element?.split(',');
        if (!isNaN(element?.[0] as any)) {
            weapon.stats.elementDamage = Number(element[0]);
        }

        if (element?.[1]) {
            weapon.element = element[1];
        }

        return weapon;
    }
}
