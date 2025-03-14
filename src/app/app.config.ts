import {
    ApplicationConfig,
    inject,
    provideAppInitializer,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { DecorationService } from './services/decoration.service';
import { EquipmentService } from './services/equipment.service';
import { SkillService } from './services/skill.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(),
        provideAppInitializer(() => {
            const equipmentService = inject(EquipmentService);
            equipmentService.loadEquipment();
            equipmentService.loadWeapons();
            inject(SkillService).loadSkills();
            inject(DecorationService).loadDecorations();
        }),
    ],
};
