import { Clipboard } from '@angular/cdk/clipboard';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    OnInit,
    signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArmorSelectorComponent } from '../../components/armor-selector/armor-selector.component';
import { ContainerComponent } from '../../components/container/container.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { GearType } from '../../enums/armor-type.enum';
import { Gear } from '../../models/gear.model';
import { Loadout } from '../../models/loadout.model';
import { LoadoutService } from '../../services/loadout.service';

@Component({
    selector: 'app-builder',
    imports: [
        ArmorSelectorComponent,
        StatsComponent,
        ContainerComponent,
        RouterModule,
    ],
    templateUrl: './builder.component.html',
    styleUrl: './builder.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderComponent implements OnInit {
    weapon = signal<Gear | undefined | null>(null);
    head = signal<Gear | undefined | null>(null);
    chest = signal<Gear | undefined | null>(null);
    waist = signal<Gear | undefined | null>(null);
    arms = signal<Gear | undefined | null>(null);
    legs = signal<Gear | undefined | null>(null);
    charm = signal<Gear | undefined | null>(null);

    loadout = computed<Loadout>(() => {
        return {
            weapon: this.weapon() as Gear,
            head: this.head() as Gear,
            chest: this.chest() as Gear,
            waist: this.waist() as Gear,
            arms: this.arms() as Gear,
            legs: this.legs() as Gear,
            charm: this.charm() as Gear,
        };
    });

    initialized = signal(false);
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private loadoutService: LoadoutService,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        const buildString = this.route.snapshot.queryParams['build'];
        if (buildString) {
            const build: Loadout | undefined =
                this.loadoutService.decodeLoadout(buildString);

            this.weapon.set(build?.weapon);
            this.head.set(build?.head);
            this.chest.set(build?.chest);
            this.waist.set(build?.waist);
            this.arms.set(build?.arms);
            this.legs.set(build?.legs);
            this.charm.set(build?.charm);
        }
    }

    copyLoadout() {
        return this.router
            .navigate(['.'], {
                queryParams: {
                    build: this.loadoutService.encodeLoadout(this.loadout()),
                },
            })
            .then(() => this.clipboard.copy(window.location.href));
    }

    setEquipmentId(id: number, index: number) {
        const gear: Gear = {
            id: id,
            type: GearType.HEAD,
            name: '',
            set: '',
            stats: {},
            skills: [],
            slots: [],
        };
        if (index === 0) {
            gear.type = GearType.WEAPON;
            this.weapon.set(gear);
        }
        if (index === 1) {
            gear.type = GearType.HEAD;
            this.head.set(gear);
        }
        if (index === 2) {
            gear.type = GearType.CHEST;
            this.chest.set(gear);
        }
        if (index === 3) {
            gear.type = GearType.WAIST;
            this.waist.set(gear);
        }
        if (index === 4) {
            gear.type = GearType.ARMS;
            this.arms.set(gear);
        }
        if (index === 5) {
            gear.type = GearType.LEGS;
            this.legs.set(gear);
        }
        if (index === 6) {
            gear.type = GearType.CHARM;
            this.charm.set(gear);
        }
    }
}
