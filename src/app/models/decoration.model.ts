import { GearSkill } from './gear-skill.model';

export type SlotLevel = 1 | 2 | 3 | 4;

export interface Decoration {
    skills: GearSkill[];
    slotLevel: SlotLevel;
    name: string;
    color: string;
}

export interface DecorationSlot {
    level: SlotLevel;
}
