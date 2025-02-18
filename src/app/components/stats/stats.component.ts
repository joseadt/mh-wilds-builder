import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';
import { ArmorSkill } from '../../models/armor-skill.model';
import { Armor } from '../../models/armor.model';
import { Equipment } from '../../models/equipment.model';
import { Stats } from '../../models/stats.model';
import { ContainerComponent } from '../container/container.component';
import { SkillComponent } from './skill/skill.component';
import { StatComponent } from './stat/stat.component';

@Component({
    selector: 'app-stats',
    imports: [ContainerComponent, StatComponent, SkillComponent],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
    equipment = input<Equipment>({});

    stats = computed(() => this.calculateStats());

    skills = computed(() => this.calculateSkills());

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

        for (const item of Object.values(this.equipment())) {
            for (const stat in stats) {
                const key = stat as keyof Stats;
                stats[key]! += item?.stats[key] || 0;
            }
        }

        return stats;
    }

    private calculateSkills(): ArmorSkill[] {
        const data = Object.values(this.equipment())
            .filter((a) => a)
            .map((a: Armor) => a?.skills)
            .flat()
            .reduce(this.skillAccumulator, {});

        return Object.values(data).sort(
            (a: any, b: any) => b?.level - a?.level
        ) as ArmorSkill[];
    }

    private skillAccumulator(acc: any, current: ArmorSkill) {
        acc[current.name] = acc[current.name] || {
            name: current.name,
            level: 0,
        };

        acc[current.name].level += current.level;
        return acc;
    }
}
