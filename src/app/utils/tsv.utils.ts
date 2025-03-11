import { DecorationSlot, isSlotLevel } from '../models/decoration.model';
import { GearSkill } from '../models/gear-skill.model';

export function skillsMapper(tsvSkillCollumn: string): GearSkill[] {
    return tsvSkillCollumn
        ?.split(',')
        ?.map((tsvSkill) => {
            const regex = /^(.+?)\s(\d+)$/;
            const match = tsvSkill.match(regex);

            if (match) {
                return {
                    name: match[1],
                    level: Number(match[2]),
                };
            }

            return null;
        })
        .filter((s) => s) as GearSkill[];
}

export function slotMapper(slotsString: string): DecorationSlot[] {
    return (
        slotsString
            ?.split('')
            .map(Number)
            .filter(isSlotLevel)
            .map((level) => ({ level } as DecorationSlot)) || []
    );
}
