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
import { Armor } from '../../models/armor.model';

@Component({
    selector: 'app-equipment-search-modal',
    imports: [FormsModule, CommonModule],
    templateUrl: './equipment-search-modal.component.html',
    styleUrl: './equipment-search-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'modal-dialog container light',
    },
})
export class EquipmentSearchModalComponent {
    data = inject(DIALOG_DATA);

    searchText = signal('');

    items = computed(() =>
        this.data.equipment.filter((e: Armor) =>
            e.name.toLowerCase().includes(this.searchText().toLowerCase())
        )
    );

    constructor(private dialogRef: DialogRef) {}

    selected(item: Armor) {
        this.dialogRef.close({ selection: item });
    }
}
