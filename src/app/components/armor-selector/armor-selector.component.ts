import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, input, model, OnInit } from '@angular/core';
import { GearType, WeaponType } from '../../enums/armor-type.enum';
import { DecorationSlot } from '../../models/decoration.model';
import { Gear, isWeapon } from '../../models/gear.model';
import { DecorationService } from '../../services/decoration.service';
import { EquipmentService } from '../../services/equipment.service';
import { ContainerComponent } from '../container/container.component';
import { DecorationSearchModalComponent } from '../decoration-search-modal/decoration-search-modal.component';
import { EquipmentSearchModalComponent } from '../equipment-search-modal/equipment-search-modal.component';

@Component({
    selector: 'app-armor-selector',
    imports: [DialogModule, ContainerComponent, CommonModule],
    templateUrl: './armor-selector.component.html',
    styleUrl: './armor-selector.component.scss',
})
export class ArmorSelectorComponent implements OnInit {
    type = input(GearType.HEAD, {
        transform: (value: GearType | keyof typeof GearType) =>
            typeof value === 'string' ? GearType[value] : value,
    });

    iconUrl = computed(() => this.computeIconUrl());

    selected = model<Gear | null | undefined>(null);

    constructor(
        private equipmentService: EquipmentService,
        private decorationService: DecorationService,
        private dialog: Dialog
    ) {}

    ngOnInit(): void {}

    computeIconUrl() {
        const selected = this.selected();
        if (isWeapon(selected)) {
            return `/images/${selected.weaponType.toLowerCase()}.png`;
        }

        const iconName =
            this.type() === GearType.WEAPON
                ? WeaponType.GREATSWORD
                : this.type();
        return `/images/${iconName.toLowerCase()}.png`;
    }

    onClick() {
        const dialogRef = this.dialog.open(EquipmentSearchModalComponent, {
            data: {
                equipment: this.equipmentService.get(this.type()),
                weapon: this.type() === GearType.WEAPON,
                gearType: this.type(),
            },
        });

        dialogRef.closed.subscribe((result: any) => {
            if (result?.selection) {
                this.selected.update(() => result.selection as Gear);
            }
        });
    }

    onClickSlot(slot: DecorationSlot) {
        if (!slot) {
            return;
        }
        const dialogRef = this.dialog.open(DecorationSearchModalComponent, {
            data: {
                decorations: this.decorationService.get(slot.level!),
            },
        });

        dialogRef.closed.subscribe((result: any) => {
            if (result?.selection) {
                this.selected.update((currentValue) => {
                    if (!currentValue) {
                        return null;
                    }
                    slot.equiped = result.selection;
                    return { ...currentValue! };
                });
            }
        });
    }

    clearArmor() {
        this.selected.set(null);
    }

    clearSlot(item: DecorationSlot) {
        this.selected.update((currentValue) => {
            if (!currentValue) {
                return null;
            }
            item.equiped = undefined;
            return { ...currentValue! };
        });
    }

    slotUrl(slotLevel: number) {
        return `images/decoration/${slotLevel}.png`;
    }
}
