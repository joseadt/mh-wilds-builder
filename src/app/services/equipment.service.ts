import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GearType } from '../enums/armor-type.enum';
import { Gear } from '../models/gear.model';

@Injectable({
    providedIn: 'root',
})
export class EquipmentService {
    private armor!: Gear[];

    constructor(private httpClient: HttpClient) {}

    loadArmor() {
        this.httpClient
            .get<Gear[]>(environment.baseUrl + 'armor.json')
            .subscribe((result) => (this.armor = result));
    }

    get(armorType: GearType): Gear[] {
        return this.armor?.filter((a) => a.type === armorType);
    }
}
