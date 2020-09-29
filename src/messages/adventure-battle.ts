import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';
import { IEnemy } from '../interfaces/enemy';

const makeAdventureBattleMessage = (area: IArea, enemy: IEnemy, username: string) => {
    if (enemy.type === 'boss') {
        return makeBossMessage(area, enemy, username);
    }

    if (enemy.type === 'mini-boss') {
        return makeMiniBossMessage(area, enemy, username);
    }

    return makeMonsterMessage(area, enemy, username);
}

const makeMonsterMessage = (area: IArea, enemy: IEnemy, username: string) => {
    const desc = [
        `The path ahead winds down into a valley below. **${username}** is excited to go see what could be found, but ${enemy.prefix} ${enemy.name} just landed in front of you glaring!`,
        ``,
        `What will you do and will other heroes be brave enough to help you?`,
        ``,
        `Heroes have ${enemy.battleDurationMinutes} minutes to participate via reaction:`,
        ``,
        `React with:`,
        `**Fight (⚔️)** - **Spell (✨)** - **Talk (🗣)** - **Pray (🙏)** - **Run (🏃‍♂️)**`,
    ];

    return new MessageEmbed()
        .setTitle(`You feel adventurous: ${username}?`)
        .setColor(area.color)
        .setDescription(desc.join('\n'))
        .setThumbnail(enemy.image);
};

const makeMiniBossMessage = (area: IArea, enemy: IEnemy, username: string) => {
    const desc = [
        `The path ahead winds down into a valley below. **${username}** is excited to go see what could be found, but ${enemy.prefix} ${enemy.name} just landed in front of you glaring!`,
        ``,
        `\`\`\`css`,
        `[⚠️ Warning: Strong enemy detected! ⚠️]`,
        `\`\`\``,
        ``,
        `What will you do and will other heroes be brave enough to help you?`,
        ``,
        `Heroes have ${enemy.battleDurationMinutes} minutes to participate via reaction:`,
        ``,
        `React with:`,
        `**Fight (⚔️)** - **Spell (✨)** - **Talk (🗣)** - **Pray (🙏)** - **Run (🏃‍♂️)**`,
    ];

    return new MessageEmbed()
        .setTitle(`You feel adventurous: ${username}?`)
        .setColor(area.miniBossColor)
        .setDescription(desc.join('\n'))
        .setImage(enemy.image);
};

const makeBossMessage = (area: IArea, enemy: IEnemy, username: string) => {
    const desc = [
        `The path ahead winds down into a valley below. **${username}** is excited to go see what could be found, but ${enemy.prefix} ${enemy.name} just landed in front of you glaring!`,
        ``,
        `\`\`\`css`,
        `[⚠️ Warning: EXTREMELY Strong enemy detected! ⚠️]`,
        `\`\`\``,
        ``,
        `What will you do and will other heroes be brave enough to help you?`,
        ``,
        `Heroes have ${enemy.battleDurationMinutes} minutes to participate via reaction:`,
        ``,
        `React with:`,
        `**Fight (⚔️)** - **Spell (✨)** - **Talk (🗣)** - **Pray (🙏)** - **Run (🏃‍♂️)**`,
    ];

    return new MessageEmbed()
        .setTitle(`You feel adventurous: ${username}?`)
        .setColor(area.bossColor)
        .setDescription(desc.join('\n'))
        .setImage(enemy.image);
};

export { makeAdventureBattleMessage };