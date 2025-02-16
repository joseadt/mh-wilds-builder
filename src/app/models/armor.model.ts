import { ArmorType } from '../enums/armor-type.enum';
import { ArmorSkill } from './skills.model';
import { Stats } from './stats.model';

export interface Armor {
    id: number;
    type: ArmorType;
    name: string;
    set: string;
    stats: Stats;
    skills: ArmorSkill[];
}
