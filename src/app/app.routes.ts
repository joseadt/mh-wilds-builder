import { Routes } from '@angular/router';
import { BuilderComponent } from './pages/builder/builder.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: BuilderComponent,
    },
];
