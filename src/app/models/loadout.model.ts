import { Gear } from './gear.model';

export interface Loadout {
    weapon?: Gear;
    head?: Gear;
    chest?: Gear;
    arms?: Gear;
    waist?: Gear;
    legs?: Gear;
    charm?: Gear;
}
