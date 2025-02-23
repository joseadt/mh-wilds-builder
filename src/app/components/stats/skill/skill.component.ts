import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    HostListener,
    inject,
    input,
    signal,
    untracked,
} from '@angular/core';
import { ArmorSkill } from '../../../models/armor-skill.model';
import { SkillService } from '../../../services/skill.service';

@Component({
    selector: 'app-skill',
    imports: [CommonModule, OverlayModule],
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

    skillDescription = computed(() => {
        const levels = this.storedSkill()?.levels;
        if (!levels) {
            return null;
        }

        const level = this.armorSkill().level;
        return levels.at(this.armorSkill().level < levels.length ? level : -1)
            ?.description;
    });

    isHovered = signal(false);

    @HostListener('mouseenter')
    onMouseEnter() {
        this.isHovered.set(true);
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.isHovered.set(false);
    }

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
