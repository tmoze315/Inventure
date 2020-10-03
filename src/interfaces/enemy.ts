interface IEnemy {
    name: string,
    baseHp: number,
    basePersuasionResistance: number,
    image: string,
    prefix: string,
    battleDurationMinutes: number,
    type: 'standard' | 'mini-boss',
    isBoss: false,
    xpMultiplier: number,
    goldMultiplier: number,
}

interface IBoss {
    name: string,
    description: string,
    baseHp: number,
    baseXp: number,
    basePersuasionResistance: number,
    image: string,
    battleDurationMinutes: number,
    isBoss: true,
    xpMultiplier: number,
    goldMultiplier: number;
}

export { IEnemy, IBoss };
