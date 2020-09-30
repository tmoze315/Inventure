import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';
import { IGuild } from '../models/Guild';

const makeChangeAreaConfirmationMessage = (username: string, area: IArea, guild: IGuild, timeRemaining: string) => {
    const desc = [
        `This will cost your guild ${area.travelCost.toLocaleString()} gold. You currently have ${guild.get('currency').toLocaleString()} gold`,
        ``,
        `**About ${area.name}:**`,
        `${area.emoji} - _${area.description}_`,
    ];

    return new MessageEmbed()
        .setTitle(`${username} would like to travel to ${area.name}.`)
        .setDescription(desc.join('\n'))
        .setFooter(`Please confirm by using the reactions below. Travelling to new areas must be a unanimous decision. You have ${timeRemaining} left to react`)
        .setColor('BLUE');
}

export { makeChangeAreaConfirmationMessage }; 