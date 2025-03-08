export type StatKey = keyof Stats;

export interface Stats {
    attack?: number;
    elementDamage?: number;
    affinity?: number;
    critBoost?: number;
    defense?: number;
    fireResist?: number;
    waterResist?: number;
    thunderResist?: number;
    iceResist?: number;
    dragonResist?: number;
}
