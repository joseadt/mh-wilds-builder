import { Stats } from './stats.model';

export interface ArmorSkill {
    name: string;
    level: number;
}
export interface Skill {
    name: string;
    stats?: Stats;
}
