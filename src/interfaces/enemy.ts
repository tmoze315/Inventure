interface IEnemy {
    name: string,
    baseHp: number,
    basePersuasionResistance: number,
    image: string,
    prefix: string,
    battleDurationMinutes: number,
    type: 'standard' | 'mini-boss',
}

interface IBoss {
    name: string,
    description: string,
    baseHp: number,
    basePersuasionResistance: number,
    image: string,
    battleDurationMinutes: number,
}

export { IEnemy, IBoss };
