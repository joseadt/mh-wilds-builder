import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
} from '@angular/core';
import { GearSkill } from '../../models/gear-skill.model';
import { Gear } from '../../models/gear.model';
import { Loadout } from '../../models/loadout.model';
import { EffectType } from '../../models/skill.model';
import { StatKey, Stats } from '../../models/stats.model';
import { SkillService } from '../../services/skill.service';
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
    // DI
    skillService = inject(SkillService);

    // Attributes
    loadout = input.required<Loadout>();

    baseStats = computed(() => this.calculateBaseStats());

    stats = computed(() => this.calculateStats());

    skills = computed(() => this.calculateSkills());

    private calculateBaseStats(): Stats {
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
            elementDamage: 0,
        };

        for (const item of Object.values(this.loadout())) {
            for (const stat in stats) {
                const key = stat as StatKey;
                if (!isNaN(item?.stats[key])) {
                    stats[key]! += item?.stats[key];
                }
            }
        }
        return stats;
    }

    private calculateStats(): Stats {
        const stats = { ...this.baseStats() };

        for (const skill of this.skills()) {
            const level = this.skillService.getLevel(skill.name, skill.level);
            level?.effects?.forEach((se) => {
                if (se.type === EffectType.ADD) {
                    stats[se.stat]! += se.value;
                }
            });
        }

        return stats;
    }

    private calculateSkills(): GearSkill[] {
        const data = Object.values(this.loadout())
            .filter((a) => a)
            .map((a: Gear) => a?.skills)
            .flat()
            .reduce(this.skillAccumulator, {});

        return Object.values(data).sort(
            (a: any, b: any) => b?.level - a?.level
        ) as GearSkill[];
    }

    private skillAccumulator(acc: any, current: GearSkill) {
        if (!current) {
            return acc;
        }
        acc[current.name] = acc[current.name] || {
            name: current.name,
            level: 0,
        };

        acc[current.name].level += current.level;
        return acc;
    }
}
