import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    untracked,
} from '@angular/core';
import { ArmorSkill } from '../../../models/armor-skill.model';
import { SkillService } from '../../../services/skill.service';

@Component({
    selector: 'app-skill',
    imports: [CommonModule],
    templateUrl: './skill.component.html',
    styleUrl: './skill.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillComponent {
    skillService = inject(SkillService);

    armorSkill = input.required<ArmorSkill>({
        alias: 'skill',
    });

    storedSkill = computed(() => {
        const skill = this.armorSkill();
        return untracked(() => this.skillService.get(skill.name));
    });

    maxLevel = computed(() => this.storedSkill()?.levels?.length);

    getStyle(index: number) {
        if (
            this.storedSkill()?.color != null &&
            index < this.armorSkill().level
        ) {
            return { 'background-color': this.storedSkill()?.color };
        }

        return {};
    }
}
