export enum Stat {
    ATTACK = 'ATTACK',
    AFFINITY = 'AFFINITY',
    CRITICAL_BOOST = 'CRITICAL_BOOST',
    DEFFENSE = 'DEFFENSE',
    FIRE_RESIST = 'FIRE_RESIST',
    WATER_RESIST = 'WATER_RESIST',
    THUNDER_RESIST = 'THUNDER_RESIST',
    ICE_RESIST = 'ICE_RESIST',
    DRAGON_RESIST = 'DRAGON_RESIST',
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
