import { GearType, WeaponType } from '../enums/armor-type.enum';
import { DecorationSlot } from './decoration.model';
import { GearSkill } from './gear-skill.model';
import { Stats } from './stats.model';

export interface Gear {
    id: number;
    type: GearType;
    name: string;
    set: string;
    stats: Stats;
    skills: GearSkill[];
    slots: DecorationSlot[];
}

export interface Weapon extends Gear {
    weaponType: WeaponType;
}

export function isWeapon(value: any): value is Weapon {
    return value?.weaponType;
}
