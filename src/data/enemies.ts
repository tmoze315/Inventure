interface IEnemy {
    name: string,
    baseHp: number,
    basePersuasionResistance: number,
    image: string,
    prefix: string,
    battleDurationMinutes: number,
    type: 'monster' | 'boss',
}

const enemies = [
    <IEnemy>{
        name: 'Abyssal Demon',
        prefix: 'an',
        baseHp: 135,
        basePersuasionResistance: 180,
        image: 'https://www.maxpixel.net/static/photo/1x/Fire-Demon-Flames-Chaos-Burn-Inflamed-Devil-Hell-2708544.jpg',
        type: 'monster',
        battleDurationMinutes: 2,
    },
    <IEnemy>{
        name: 'Bronze Dragon',
        prefix: 'a',
        baseHp: 260,
        basePersuasionResistance: 250,
        image: 'https://cdn.pixabay.com/photo/2017/01/13/07/57/dragon-1976596_960_720.jpg',
        type: 'boss',
        battleDurationMinutes: 5,
    },
];

export { enemies, IEnemy };