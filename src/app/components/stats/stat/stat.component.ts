import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { STATS_I18N } from '../../../i18n/i18n';
import { Stats } from '../../../models/stats.model';

@Component({
    selector: 'app-stat',
    imports: [],
    templateUrl: './stat.component.html',
    styleUrl: './stat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatComponent {
    stats = input<Stats>({});

    STATS_I18N = STATS_I18N;

    field = input<keyof Stats | null>(null);
}
