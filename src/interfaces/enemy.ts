interface IEnemy {
    name: string,
    baseHp: number,
    basePersuasionResistance: number,
    image: string,
    prefix: string,
    battleDurationMinutes: number,
    type: 'standard' | 'mini-boss' | 'boss',
}

export { IEnemy };
