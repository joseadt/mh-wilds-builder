import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
} from '@angular/core';
import { STATS_I18N } from '../../../i18n/i18n';
import { StatKey } from '../../../models/stats.model';
import { StatsComponent } from '../stats.component';

@Component({
    selector: 'app-stat',
    imports: [],
    templateUrl: './stat.component.html',
    styleUrl: './stat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatComponent {
    parent = inject(StatsComponent);

    field = input.required<StatKey>();

    baseStat = computed(() => this.parent.baseStats()[this.field()]);

    statValue = computed(() => this.parent.stats()[this.field()]);

    STATS_I18N = STATS_I18N;
}
