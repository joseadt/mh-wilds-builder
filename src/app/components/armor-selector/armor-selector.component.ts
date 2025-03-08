import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    effect,
    input,
    linkedSignal,
    model,
    signal,
} from '@angular/core';
import { GearType, WeaponType } from '../../enums/armor-type.enum';
import { Decoration } from '../../models/decoration.model';
import { GearSkill } from '../../models/gear-skill.model';
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
export class ArmorSelectorComponent {
    type = input(GearType.HEAD, {
        transform: (value: GearType | keyof typeof GearType) =>
            typeof value === 'string' ? GearType[value] : value,
    });

    iconUrl = computed(() => this.computeIconUrl());

    selectedAmor = signal<Gear | null>(null);

    selected = model<Gear | null | undefined>(null);

    slots = linkedSignal(() =>
        this.selectedAmor()
            ?.slots?.sort((s1, s2) => s1.level - s2.level)
            ?.map((s) => ({ slotLevel: s.level } as Partial<Decoration>))
    );

    constructor(
        private equipmentService: EquipmentService,
        private decorationService: DecorationService,
        private dialog: Dialog
    ) {
        effect(() => {
            if (!this.selectedAmor()) {
                this.selected.set(null);
                return;
            }
            const selected = structuredClone(this.selectedAmor()) as Gear;

            const slotSkills = this.slots()
                ?.map((s) => s.skills)
                .filter((s) => s)
                .flat();
            if (slotSkills?.length) {
                selected?.skills?.push(...(slotSkills as GearSkill[]));
            }

            this.selected.set(selected);
        });
    }

    computeIconUrl() {
        const selected = this.selectedAmor();
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
                this.selectedAmor.update(() => result.selection as Gear);
            }
        });
    }

    onClickSlot(slotIndex: number) {
        const slot = this.slots()?.[slotIndex];
        if (!slot) {
            return;
        }
        const dialogRef = this.dialog.open(DecorationSearchModalComponent, {
            data: {
                decorations: this.decorationService.get(slot.slotLevel!),
            },
        });

        dialogRef.closed.subscribe((result: any) => {
            if (result?.selection) {
                this.slots.update((currentValue) => {
                    const slots = [...currentValue!];
                    slots[slotIndex] = result?.selection;
                    return slots;
                });
            }
        });
    }

    clearArmor() {
        this.selectedAmor.set(null);
    }

    clearSlot(index: number) {
        this.slots.update((currentValue) =>
            currentValue?.toSpliced(index, 1, {
                slotLevel: currentValue[index].slotLevel,
            })
        );
    }

    slotUrl(slotLevel: number) {
        return `images/decoration/${slotLevel}.png`;
    }
}
