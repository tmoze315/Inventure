import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';
import { IEnemy } from '../interfaces/enemy';

const makeAdventureBattleMessage = (area: IArea, enemy: IEnemy, username: string) => {
    if (enemy.type === 'mini-boss') {
        return makeMiniBossMessage(area, enemy, username);
    }

    return makeMonsterMessage(area, enemy, username);
}

const makeMonsterMessage = (area: IArea, enemy: IEnemy, username: string) => {
    const desc = [
        `The path ahead winds down into a valley below. **${username}** is excited to go see what could be found, but ${enemy.prefix} ${enemy.name} just landed in front of you glaring!`,
        ``,
        `What will you do? You have ${enemy.battleDurationMinutes} minutes to decide.`,
        ``,
        `React with:`,
        `**Fight (⚔️)** - **Spell (✨)** - **Persuade (🗣)** - **Run (🏃‍♂️)**`,
    ];

    return new MessageEmbed()
        .setTitle(`${username} is feeling adventurous`)
        .setColor(area.color)
        .setDescription(desc.join('\n'))
        .setFooter(`Location: ${area.name}`)
        .setThumbnail(enemy.image);
};

const makeMiniBossMessage = (area: IArea, enemy: IEnemy, username: string) => {
    const desc = [
        `The path ahead winds down into a valley below. **${username}** is excited to go see what could be found, but ${enemy.prefix} ${enemy.name} just landed in front of you glaring!`,
        ``,
        `\`\`\`yaml`,
        `[Warning: Strong enemy detected!]`,
        `\`\`\``,
        ``,
        `What will you do? You have ${enemy.battleDurationMinutes} minutes to decide.`,
        ``,
        `React with:`,
        `**Fight (⚔️)** - **Spell (✨)** - **Persuade (🗣)** - **Run (🏃‍♂️)**`,
    ];

    return new MessageEmbed()
        .setTitle(`${username} is feeling adventurous`)
        .setColor(area.miniBossColor)
        .setDescription(desc.join('\n'))
        .setFooter(`Location: ${area.name}`)
        .setImage(enemy.image);
};

export { makeAdventureBattleMessage };