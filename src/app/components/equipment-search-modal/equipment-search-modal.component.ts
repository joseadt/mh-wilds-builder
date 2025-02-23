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
import { Gear } from '../../models/gear.model';

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
        this.data.equipment.filter((e: Gear) =>
            e.name.toLowerCase().includes(this.searchText().toLowerCase())
        )
    );

    constructor(private dialogRef: DialogRef) {}

    selected(item: Gear) {
        this.dialogRef.close({ selection: item });
    }
}
