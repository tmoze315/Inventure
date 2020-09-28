import { EmbedFieldData } from 'discord.js';
import { MessageEmbed } from 'discord.js';

const makeAdventureResults = () => {
    const desc = [
        `The group killed the Ascended Cave Lion (1,267/892).`,
        `TODO: Make this clever`,
    ];

    return new MessageEmbed()
        .setColor('DARK_GREEN') // WIN/LOSE colours
        .setDescription(desc.join('\n'))
        .addFields([
            <EmbedFieldData>{
                name: 'tmoze315',
                value: `🎲 Rolled a 20\n⚔️ Damage: 400`,
                inline: true,
            },
            <EmbedFieldData>{
                name: 'YoItsBK',
                value: `🎲 Rolled a 20\n⚔️ Damage: 400\n💥 Bonus Damage: 301`,
                inline: true,
            },
        ]);
}

export { makeAdventureResults };
