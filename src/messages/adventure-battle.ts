import { MessageEmbed } from 'discord.js';

const makeAdventureBattleMessage = (username: string) => {
    const desc = [
        `The path ahead winds down into a valley below. **${username}** is excited to go see what could be found, but a plagued Ascended Jade Drake just landed in front of you glaring!`,
        ``,
        `What will you do and will other heroes be brave enough to help you?`,
        ``,
        `Heroes have 2 minutes to participate via reaction:`,
        ``,
        `React with:`,
        `**Fight (⚔️)** - **Spell (✨)** - **Talk (🗣)** - **Pray (🙏)** - **Run (🏃‍♂️)**`,
    ];

    return new MessageEmbed()
        .setTitle(`You feel adventurous: ${username}?`)
        .setColor('DARK_GOLD')
        .setDescription(desc.join('\n'))
        .setImage('https://upload.wikimedia.org/wikipedia/commons/d/d8/Friedrich-Johann-Justin-Bertuch_Mythical-Creature-Dragon_1806.jpg');
}

export { makeAdventureBattleMessage };