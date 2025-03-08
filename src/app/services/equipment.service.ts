import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { environment } from '../../environments/environment';
import { GearType, WeaponType } from '../enums/armor-type.enum';
import { isSlotLevel } from '../models/decoration.model';
import { GearSkill } from '../models/gear-skill.model';
import { Gear, Weapon } from '../models/gear.model';

const WEAPONS_NAMES: { [fileName: string]: WeaponType } = {
    'bow.tsv': WeaponType.BOW,
    'chargeblade.tsv': WeaponType.CHARGE_BLADE,
    'dualblades.tsv': WeaponType.DUAL_BLADES,
    'greatsword.tsv': WeaponType.GREATSWORD,
    'gunlance.tsv': WeaponType.GUNLANCE,
    'hammer.tsv': WeaponType.HAMMER,
    'heavybowgun.tsv': WeaponType.HEAVY_BOWGUN,
    'huntinghorn.tsv': WeaponType.HUNTING_HORN,
    'insectglaive.tsv': WeaponType.INSECT_GLAIVE,
    'lance.tsv': WeaponType.LANCE,
    'lightbowgun.tsv': WeaponType.LIGHT_BOWGUN,
    'longsword.tsv': WeaponType.LONG_SWORD,
    'sns.tsv': WeaponType.SWORD_AND_SHIELD,
    'switchaxe.tsv': WeaponType.SWITCH_AXE,
};

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
export class EquipmentService {
    private armor!: Gear[];

    private weapons!: Weapon[];

    private weaponMap!: Map<WeaponType, Weapon[]>;

    constructor(private httpClient: HttpClient) {}

    loadArmor() {
        this.httpClient
            .get<Gear[]>(environment.baseUrl + 'armor.json')
            .subscribe((result) => (this.armor = result));
    }

    loadWeapons() {
        if (environment.tsv) {
            this.getTsvWeapons();
            return;
        }

        this.httpClient
            .get<Weapon[]>(environment.baseUrl + 'weapons.json')
            .subscribe((result) => (this.weapons = result));
    }

    get(armorType: GearType): Gear[] {
        if (armorType === GearType.WEAPON) {
            return this.weaponMap.get(WeaponType.BOW) as Gear[];
        }
        return this.armor?.filter((a) => a.type === armorType);
    }

    getWeapons(weaponType: WeaponType): Weapon[] {
        return this.weaponMap.get(weaponType)!;
    }

    private async getTsvWeapons() {
        this.weaponMap = new Map<WeaponType, Weapon[]>();
        for (const fileName in WEAPONS_NAMES) {
            this.retrieveTsvWeapon(fileName, WEAPONS_NAMES[fileName]);
        }
    }

    private retrieveTsvWeapon(fileName: string, weaponType: WeaponType) {
        this.httpClient
            .get(environment.weaponBaseUrl + fileName, {
                responseType: 'text',
            })
            .subscribe((result) => {
                Papa.parse<TsvWeapon>(result as string, {
                    delimiter: '\t',
                    header: true,
                    skipEmptyLines: true,
                    complete: (parsed) => {
                        this.weapons = parsed.data.map((row) =>
                            this.tsvToWeapon(row, weaponType)
                        );
                        this.weaponMap.set(
                            weaponType,
                            parsed.data.map((row) =>
                                this.tsvToWeapon(row as TsvWeapon, weaponType)
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
            slots: [],
            skills: [],
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

        const slots = tsvRow.slots?.split('') || [];
        slots
            .map(Number)
            .filter(isSlotLevel)
            .forEach((level) => weapon.slots.push({ level }));

        weapon.skills =
            (tsvRow.skills
                ?.split(',')
                .map(this.skillsMapper)
                .filter((s) => s) as GearSkill[]) || [];

        return weapon;
    }

    private skillsMapper(tsvSkill: string): GearSkill | null {
        const regex = /^(.+?)\s(\d+)$/;
        const match = tsvSkill.match(regex);

        if (match) {
            return {
                name: match[1],
                level: Number(match[2]),
            };
        }

        return null;
    }
}
