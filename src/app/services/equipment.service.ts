import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { GearType, WeaponType } from '../enums/armor-type.enum';
import { Gear, Weapon } from '../models/gear.model';
import { EquipmentTsvReaderService } from './equipment-tsv-reader.service';
import { WeaponTsvReaderService } from './weapon-tsv-reader.service';

const WEAPONS_NAMES: { [fileName: string]: WeaponType } = {
    'bow.tsv': WeaponType.BOW,
    'chargeblade.tsv': WeaponType.CHARGE_BLADE,
    'dualblades.tsv': WeaponType.DUAL_BLADES,
    'greatsword.tsv': WeaponType.GREATSWORD,
    'gunlance.tsv': WeaponType.GUNLANCE,
    'hammer.tsv': WeaponType.HAMMER,
    'heavybowgun.tsv': WeaponType.HEAVY_BOWGUN,
    'huntinghorn.tsv': WeaponType.HUNTING_HORN,
    'insectglaive.tsv': WeaponType.INSECT_GLAIVE,
    'lance.tsv': WeaponType.LANCE,
    'lightbowgun.tsv': WeaponType.LIGHT_BOWGUN,
    'longsword.tsv': WeaponType.LONG_SWORD,
    'sns.tsv': WeaponType.SWORD_AND_SHIELD,
    'switchaxe.tsv': WeaponType.SWITCH_AXE,
};

@Injectable({
    providedIn: 'root',
})
export class EquipmentService {
    private armor!: Gear[];

    private weaponMap!: Map<WeaponType, Weapon[]>;

    private charms!: Gear[];

    constructor(
        private httpClient: HttpClient,
        private equipmentTsvReader: EquipmentTsvReaderService,
        private weaponTsvReader: WeaponTsvReaderService
    ) {}

    async loadEquipment() {
        const tsvArmor = await firstValueFrom(
            this.httpClient.get(environment.armorUrl, { responseType: 'text' })
        );

        this.armor = [];
        this.armor.push(
            ...(await this.equipmentTsvReader.readArmorTsv(tsvArmor))
        );

        const charms = await firstValueFrom(
            this.httpClient.get(environment.charmsUrl, { responseType: 'text' })
        );

        this.armor.push(
            ...(await this.equipmentTsvReader.readCharmTsv(charms))
        );
    }

    loadWeapons() {
        this.weaponMap = new Map<WeaponType, Weapon[]>();
        for (const fileName in WEAPONS_NAMES) {
            this.retrieveTsvWeapon(fileName, WEAPONS_NAMES[fileName]);
        }
    }

    get(armorType: GearType): Gear[] {
        if (armorType === GearType.WEAPON) {
            return this.weaponMap.get(WeaponType.BOW) as Gear[];
        }
        return this.armor?.filter((a) => a.type === armorType);
    }

    getWeapons(weaponType: WeaponType): Weapon[] {
        return this.weaponMap.get(weaponType)!;
    }

    private retrieveTsvWeapon(fileName: string, weaponType: WeaponType) {
        this.httpClient
            .get(environment.weaponBaseUrl + fileName, {
                responseType: 'text',
            })
            .subscribe((result) => {
                this.weaponTsvReader
                    .readTsv(result, weaponType)
                    .then((weapons) => this.weaponMap.set(weaponType, weapons));
            });
    }
}
