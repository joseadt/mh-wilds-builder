import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal,
} from '@angular/core';
import { ArmorSelectorComponent } from '../../components/armor-selector/armor-selector.component';
import { ContainerComponent } from '../../components/container/container.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { Armor } from '../../models/armor.model';
import { Loadout } from '../../models/loadout.model';

@Component({
    selector: 'app-builder',
    imports: [ArmorSelectorComponent, StatsComponent, ContainerComponent],
    templateUrl: './builder.component.html',
    styleUrl: './builder.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderComponent {
    head = signal<Armor | null>(null);
    chest = signal<Armor | null>(null);
    waist = signal<Armor | null>(null);
    arms = signal<Armor | null>(null);
    legs = signal<Armor | null>(null);

    loadout = computed<Loadout>(() => {
        return {
            head: this.head() as Armor,
            chest: this.chest() as Armor,
            waist: this.waist() as Armor,
            arms: this.arms() as Armor,
            legs: this.legs() as Armor,
        };
    });
}
