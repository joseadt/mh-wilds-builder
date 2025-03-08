import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeaponType } from '../../enums/armor-type.enum';
import { Gear } from '../../models/gear.model';
import { EquipmentService } from '../../services/equipment.service';
import { ContainerComponent } from '../container/container.component';

@Component({
    selector: 'app-equipment-search-modal',
    imports: [FormsModule, CommonModule, ContainerComponent],
    templateUrl: './equipment-search-modal.component.html',
    styleUrl: './equipment-search-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'modal-dialog container light',
    },
})
export class EquipmentSearchModalComponent {
    data = inject(DIALOG_DATA);
    private dialogRef = inject(DialogRef);
    weaponService = inject(EquipmentService);

    WeaponType = WeaponType;

    searchText = signal('');

    weaponType = signal<WeaponType>(WeaponType.GREATSWORD);

    items = computed(() => {
        let elements: Gear[] = [];
        if (this.data.weapon) {
            elements = this.weaponService.getWeapons(this.weaponType());
        } else {
            elements = this.data.equipment;
        }

        return elements.filter((e: Gear) =>
            e.name.toLowerCase().includes(this.searchText().toLowerCase())
        );
    });

    itemIcon = computed(() => {
        if (this.data.weapon) {
            return this.weaponType().toLowerCase();
        } else {
            return this.data.gearType.toLowerCase();
        }
    });

    selected(item: Gear) {
        this.dialogRef.close({ selection: item });
    }

    changeWeaponType(weaponType: string) {
        this.weaponType.set(weaponType as WeaponType);
    }
}
