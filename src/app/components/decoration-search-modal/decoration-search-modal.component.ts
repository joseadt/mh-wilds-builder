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
import { Decoration } from '../../models/decoration.model';
import { ContainerComponent } from '../container/container.component';

@Component({
    selector: 'app-decoration-search-modal',
    imports: [ContainerComponent, CommonModule, FormsModule],
    templateUrl: './decoration-search-modal.component.html',
    styleUrl: './decoration-search-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'modal-dialog container light',
    },
})
export class DecorationSearchModalComponent {
    data = inject(DIALOG_DATA);
    dialogRef = inject(DialogRef);

    searchText = signal('');

    items = computed(() =>
        this.data.decorations.filter((d: Decoration) => {
            const searchTerm = this.searchText().toLowerCase();
            return (
                d.name.toLowerCase().includes(searchTerm) ||
                d.skills.some((s) => s.name.toLowerCase().includes(searchTerm))
            );
        })
    );

    selected(item: Decoration) {
        this.dialogRef.close({ selection: item });
    }
}
