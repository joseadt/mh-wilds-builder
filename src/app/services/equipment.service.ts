import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GearType } from '../enums/armor-type.enum';
import { Gear, Weapon } from '../models/gear.model';

@Injectable({
    providedIn: 'root',
})
export class EquipmentService {
    private armor!: Gear[];

    private weapons!: Weapon[];

    constructor(private httpClient: HttpClient) {}

    loadArmor() {
        this.httpClient
            .get<Gear[]>(environment.baseUrl + 'armor.json')
            .subscribe((result) => (this.armor = result));
    }

    loadWeapons() {
        this.httpClient
            .get<Weapon[]>(environment.baseUrl + 'weapons.json')
            .subscribe((result) => (this.weapons = result));
    }

    get(armorType: GearType): Gear[] {
        if (armorType === GearType.WEAPON) {
            return this.weapons;
        }
        return this.armor?.filter((a) => a.type === armorType);
    }
}
