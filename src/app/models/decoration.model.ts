import { GearSkill } from './gear-skill.model';

export type SlotLevel = 1 | 2 | 3 | 4;

export function isSlotLevel(value: any): value is SlotLevel {
    return [1, 2, 3, 4].includes(Number(value));
}

export interface Decoration {
    skills: GearSkill[];
    slotLevel: SlotLevel;
    name: string;
    color: string;
}

export interface DecorationSlot {
    level: SlotLevel;
}
