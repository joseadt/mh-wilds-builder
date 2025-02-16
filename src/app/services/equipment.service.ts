import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ArmorType } from '../enums/armor-type.enum';
import { Armor } from '../models/armor.model';

@Injectable({
    providedIn: 'root',
})
export class EquipmentService {
    private armor!: Armor[];

    constructor(private httpClient: HttpClient) {}

    loadArmor() {
        this.httpClient
            .get<Armor[]>(environment.baseUrl + 'armor.json')
            .subscribe((result) => (this.armor = result));
    }

    get(armorType: ArmorType): Armor[] {
        return this.armor?.filter((a) => a.type === armorType);
    }
}
