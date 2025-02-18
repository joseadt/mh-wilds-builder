import { StatKeys as StatKey } from './stats.model';

export enum EffectType {
    PERCENTAGE = 'PERCENTAGE',
    ADD = 'ADD',
    OTHER = 'OTHER',
}

export interface SkillLevelStatEffect {
    stat: StatKey;
    value: number;
    type: EffectType;
}

export interface SkillLevel {
    description?: string;
    effects?: SkillLevelStatEffect[];
}

export interface Skill {
    name: string;
    levels: SkillLevel[];
    color?: string;
}
