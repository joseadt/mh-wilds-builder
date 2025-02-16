import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, computed, input, model } from '@angular/core';
import { ArmorType } from '../../enums/armor-type.enum';
import { Armor } from '../../models/armor.model';
import { EquipmentService } from '../../services/equipment.service';
import { EquipmentSearchModalComponent } from '../equipment-search-modal/equipment-search-modal.component';

@Component({
    selector: 'app-armor-selector',
    imports: [DialogModule],
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

    selected = model<Armor | null | undefined>(null);

    constructor(
        private equipmentService: EquipmentService,
        private dialog: Dialog
    ) {}

    onClick() {
        const dialogRef = this.dialog.open(EquipmentSearchModalComponent, {
            data: {
                equipment: this.equipmentService.get(this.type()),
            },
        });

        dialogRef.closed.subscribe((result: any) => {
            if (result?.selection) {
                this.selected.update(() => result.selection as Armor);
            }
        });
    }
}
