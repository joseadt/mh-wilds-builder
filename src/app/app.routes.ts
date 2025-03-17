import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { BuilderComponent } from './pages/builder/builder.component';
import { DecorationService } from './services/decoration.service';
import { EquipmentService } from './services/equipment.service';
import { SkillService } from './services/skill.service';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: BuilderComponent,
        resolve: {
            ready: () =>
                Promise.all([
                    inject(EquipmentService).loadEquipment(),
                    inject(EquipmentService).loadWeapons(),
                    inject(DecorationService).loadDecorations(),
                    inject(SkillService).loadSkills(),
                ])
                    .then(() => true)
                    .catch(() => false),
        },
    },
];
