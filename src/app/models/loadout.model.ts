import { Armor } from './armor.model';

export interface Loadout {
    weapon?: Armor;
    head?: Armor;
    chest?: Armor;
    arms?: Armor;
    waist?: Armor;
    legs?: Armor;
}
