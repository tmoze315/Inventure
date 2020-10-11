import { MessageEmbed } from 'discord.js';
import { IPlayer, LootReward, Player } from '../models/Player';

const makeAvailableLootMessage = (availableChests: LootReward, player: IPlayer) => {
    // TODO: Actually make stats pull from player data

    let normalConvert = 0;
    


    const desc = [
        `Congratulations ${player.getHeroClass()}, you've earned these.`,
        ``,
        `**Chests**`,
        `\`\`\`css`,
        `{ Total-Chests: ${availableChests.total} }`,
        ``,
        `- Normal: ${availableChests.normal}`,
        `- Rare: ${availableChests.rare}`,
        `- Epic: ${availableChests.epic}`,
        ``,
        `- Legendary: ${availableChests.legendary}`,
        `- Ascended: ${availableChests.ascended}`,
        ``,
        `- Set: ${availableChests.set}`,
        `\`\`\``,
    ];

    // return desc.join('\n');
    return new MessageEmbed()
        .setTitle(`Available Loot`)
        .setColor('GOLD')
        .setDescription(desc.join('\n'))
        .setThumbnail('https://i.pinimg.com/564x/c8/09/b9/c809b9478526d66c24877fa2062a2b88.jpg')
        .setFooter('Tip: If you have over 25 of any chest, use -convert [type] to swap them for one chest of the next highest level!');
};

export { makeAvailableLootMessage };