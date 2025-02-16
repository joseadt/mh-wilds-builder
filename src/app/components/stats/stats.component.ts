import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';
import { Equipment } from '../../models/equipment.model';
import { Stats } from '../../models/stats.model';
import { ContainerComponent } from '../container/container.component';
import { StatComponent } from './stat/stat.component';

@Component({
    selector: 'app-stats',
    imports: [ContainerComponent, StatComponent],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
    equipment = input<Equipment>({});

    stats = computed(() => this.calculateStats());

    private calculateStats(): Stats {
        const stats: Stats = {
            attack: 0,
            affinity: 0,
            critBoost: 0,
            defense: 0,
            fireResist: 0,
            waterResist: 0,
            thunderResist: 0,
            iceResist: 0,
            dragonResist: 0,
        };

        for (const item in this.equipment()) {
            for (const stat in stats) {
                const key = stat as keyof Stats;
                stats[key]! +=
                    this.equipment()[item as keyof Equipment]?.stats[key] || 0;
            }
        }

        return stats;
    }
}
