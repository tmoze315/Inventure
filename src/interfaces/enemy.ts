interface IEnemy {
    name: string,
    baseHp: number,
    baseXp: number,
    basePersuasionResistance: number,
    image: string,
    prefix: string,
    battleDurationMinutes: number,
    type: 'standard' | 'mini-boss',
    isBoss: false,
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
}

export { IEnemy, IBoss };
