import { MessageEmbed } from 'discord.js';
import { IEnemy } from '../data/enemies';

const makeAdventureBattleMessage = (enemy: IEnemy, username: string) => {
    if (enemy.type === 'boss') {
        return makeBossMessage(enemy, username);
    }

    return makeMonsterMessage(enemy, username);
}

const makeMonsterMessage = (enemy: IEnemy, username: string) => {
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
        .setColor('#4E6F7B')
        .setDescription(desc.join('\n'))
        .setThumbnail(enemy.image);
};

const makeBossMessage = (enemy: IEnemy, username: string) => {
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
        .setColor('DARK_GOLD')
        .setDescription(desc.join('\n'))
        .setImage(enemy.image);
};

export { makeAdventureBattleMessage };