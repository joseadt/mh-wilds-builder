import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal,
} from '@angular/core';
import { ArmorSelectorComponent } from '../../components/armor-selector/armor-selector.component';
import { ContainerComponent } from '../../components/container/container.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { Gear } from '../../models/gear.model';
import { Loadout } from '../../models/loadout.model';

@Component({
    selector: 'app-builder',
    imports: [ArmorSelectorComponent, StatsComponent, ContainerComponent],
    templateUrl: './builder.component.html',
    styleUrl: './builder.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderComponent {
    weapon = signal<Gear | null>(null);
    head = signal<Gear | null>(null);
    chest = signal<Gear | null>(null);
    waist = signal<Gear | null>(null);
    arms = signal<Gear | null>(null);
    legs = signal<Gear | null>(null);
    charm = signal<Gear | null>(null);

    loadout = computed<Loadout>(() => {
        console.log(this.charm());
        return {
            weapon: this.weapon() as Gear,
            head: this.head() as Gear,
            chest: this.chest() as Gear,
            waist: this.waist() as Gear,
            arms: this.arms() as Gear,
            legs: this.legs() as Gear,
            charm: this.charm() as Gear,
        };
    });

    debugLoadout = computed<Loadout>(() => {
        console.log(this.loadout());
        return this.loadout();
    });
}
