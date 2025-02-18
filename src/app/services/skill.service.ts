import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Skill } from '../models/skill.model';

@Injectable({
    providedIn: 'root',
})
export class SkillService {
    private skills!: Skill[];

    constructor(private httpClient: HttpClient) {}

    loadSkills() {
        this.httpClient
            .get<Skill[]>(environment.baseUrl + 'skills.json')
            .subscribe((result) => (this.skills = result));
    }

    get(name: string): Skill | undefined {
        return this.skills.find((s) => s.name === name);
    }
}
