import { Injectable } from '@angular/core';
import { GearType } from '../enums/armor-type.enum';
import { Gear } from '../models/gear.model';
import { Loadout } from '../models/loadout.model';
import { DecorationService } from './decoration.service';
import { EquipmentService } from './equipment.service';

interface Equiped {
    id?: number;
    slots: (number | undefined)[];
}

@Injectable({
    providedIn: 'root',
})
export class LoadoutService {
    constructor(
        private equipmentService: EquipmentService,
        private decorationService: DecorationService
    ) {}

    decodeLoadout(buildBase64: string): Loadout | undefined {
        const buildString = this.safeAtob(buildBase64);
        if (!(buildString && this.isValidFormat(buildString))) {
            return undefined;
        }
        const items = buildString.split(';');
        return {
            weapon: this.readEquipmentString(items[0], GearType.WEAPON),
            head: this.readEquipmentString(items[1], GearType.HEAD),
            chest: this.readEquipmentString(items[2], GearType.CHEST),
            waist: this.readEquipmentString(items[3], GearType.WAIST),
            arms: this.readEquipmentString(items[4], GearType.ARMS),
            legs: this.readEquipmentString(items[5], GearType.LEGS),
            charm: this.readEquipmentString(items[6], GearType.CHARM),
        };
    }

    encodeLoadout(loadout: Loadout): string {
        return btoa(
            this.writeGearString(loadout.weapon) +
                this.writeGearString(loadout.head) +
                this.writeGearString(loadout.chest) +
                this.writeGearString(loadout.waist) +
                this.writeGearString(loadout.arms) +
                this.writeGearString(loadout.legs) +
                this.writeGearString(loadout.charm)
        );
    }

    private writeGearString(gear: Gear | undefined) {
        let gearString = `${gear?.id ?? '-'}`;

        for (let i = 0; i <= 2; i++) {
            gearString += `[${gear?.slots?.[i]?.equiped?.id ?? '-'}]`;
        }

        return gearString + ';';
    }

    private readEquipmentString(
        equipmentString: string,
        gearType: GearType
    ): Gear | undefined {
        const equipment = this.extractEquipmentId(equipmentString);

        const gear = this.equipmentService.getById(equipment?.id!, gearType);
        if (gearType === GearType.WEAPON) {
            console.log(gear);
        }

        gear?.slots?.forEach((slot, index) => {
            slot.equiped = this.decorationService.getById(
                equipment.slots[index]
            );
        });

        return gear != null ? { ...gear } : undefined;
    }

    private extractEquipmentId(item: string): Equiped {
        const match = item.match(/^(\d+)\[(\d+|-)\]\[(\d+|-)\]\[(\d+|-)\]/);
        return {
            id: this.getMatch(match, 1),
            slots: [
                this.getMatch(match, 2),
                this.getMatch(match, 3),
                this.getMatch(match, 4),
            ],
        };
    }

    private getMatch(match: RegExpMatchArray | null, index: number) {
        return match && !isNaN(Number(match[index]))
            ? parseInt(match[index])
            : undefined;
    }

    private isValidFormat(str: string) {
        // Regular expression to match the exact pattern
        const pattern = /^([\d-]+\[[\d-]+\]\[[\d-]+\]\[[\d-]+\];){7}$/;
        return pattern.test(str);
    }

    private safeAtob(str: string) {
        try {
            return atob(str);
        } catch (error) {
            console.error('Invalid build code!');
            return null;
        }
    }
}
