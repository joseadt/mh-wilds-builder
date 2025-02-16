import { Armor } from './armor.model';

export interface EquipmentPiece {
    armor: Armor;
}

export interface Equipment {
    head?: Armor;
    chest?: Armor;
    arms?: Armor;
    waist?: Armor;
    legs?: Armor;
}
