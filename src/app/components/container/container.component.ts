import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    input,
} from '@angular/core';

@Component({
    selector: 'app-container',
    imports: [CommonModule],
    templateUrl: './container.component.html',
    styleUrl: './container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
    simple = input(false, { transform: booleanAttribute });

    inline = input(false, { transform: booleanAttribute });
}
