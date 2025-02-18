export enum StatKeys {
    ATTACK = 'attack',
    AFFINITY = 'affinity',
    CRITICAL_BOOST = 'critBoost',
    DEFFENSE = 'defense',
    FIRE_RESIST = 'fireResist',
    WATER_RESIST = 'waterResist',
    THUNDER_RESIST = 'thunderResist',
    ICE_RESIST = 'iceResist',
    DRAGON_RESIST = 'dragonResist',
}

export interface Stats {
    attack?: number;
    affinity?: number;
    critBoost?: number;
    defense?: number;
    fireResist?: number;
    waterResist?: number;
    thunderResist?: number;
    iceResist?: number;
    dragonResist?: number;
}
