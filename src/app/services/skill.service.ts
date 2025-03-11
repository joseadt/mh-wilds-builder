import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Skill, SkillLevel } from '../models/skill.model';
import { SkillTsvReaderService } from './skill-tsv-reader.service';

@Injectable({
    providedIn: 'root',
})
export class SkillService {
    private skills!: Skill[];

    constructor(
        private httpClient: HttpClient,
        private skillTsvReader: SkillTsvReaderService
    ) {}

    async loadSkills() {
        this.skills = [];
        const armorSkills = await firstValueFrom(
            this.httpClient.get(environment.skillBaseUrl + 'armor_skills.tsv', {
                responseType: 'text',
            })
        );

        this.skills.push(...(await this.skillTsvReader.read(armorSkills)));

        const weaponSkills = await firstValueFrom(
            this.httpClient.get(
                environment.skillBaseUrl + 'weapon_skills.tsv',
                {
                    responseType: 'text',
                }
            )
        );

        this.skills.push(...(await this.skillTsvReader.read(weaponSkills)));
    }

    get(name: string): Skill | undefined {
        return this.skills.find((s) => s.name === name?.trim());
    }

    getLevel(name: string, level: number): SkillLevel | undefined {
        const skill = this.skills.find((s) => s.name === name);
        const levels = skill?.levels;
        return levels?.at(level < levels.length ? level : -1);
    }
}
