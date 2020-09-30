import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';
import { IGuild } from '../models/Guild';

const makeCurrentAreaMessage = (area: IArea, guild: IGuild) => {
    const desc = [
        `${area.emoji} - _${area.description}_`,
        ``,
        `**Quest Items:**`,
        `You have collected (${guild.getQuestItemsForCurrentArea()}/${area.totalQuestItemsNeeded}) ${area.questItem}.`,
    ];

    return new MessageEmbed()
        .setTitle(`You are in ${area.name}`)
        .setDescription(desc.join('\n'))
        .setColor(area.color);
}

export { makeCurrentAreaMessage }; 