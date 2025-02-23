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
import { ArmorType } from '../../enums/armor-type.enum';
import { ArmorSkill } from '../../models/armor-skill.model';
import { Armor } from '../../models/armor.model';
import { Decoration } from '../../models/decoration.model';
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
    type = input(ArmorType.HEAD, {
        transform: (value: ArmorType | keyof typeof ArmorType) =>
            typeof value === 'string' ? ArmorType[value] : value,
    });

    iconUrl = computed(
        () => `/images/${ArmorType[this.type()].toLowerCase()}.png`
    );

    selectedAmor = signal<Armor | null>(null);

    selected = model<Armor | null | undefined>(null);

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
            const selected = structuredClone(this.selectedAmor()) as Armor;

            const slotSkills = this.slots()
                ?.map((s) => s.skills)
                .filter((s) => s)
                .flat();
            if (slotSkills?.length) {
                selected?.skills?.push(...(slotSkills as ArmorSkill[]));
            }

            this.selected.set(selected);
        });
    }

    onClick() {
        const dialogRef = this.dialog.open(EquipmentSearchModalComponent, {
            data: {
                equipment: this.equipmentService.get(this.type()),
            },
        });

        dialogRef.closed.subscribe((result: any) => {
            if (result?.selection) {
                this.selectedAmor.update(() => result.selection as Armor);
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
                    console.log(currentValue);
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
