import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';

const makeChangeAreaConfirmationMessage = (username: string, area: IArea) => {
    const desc = [
        `This will cost your guild ${area.travelCost} gold`,
        ``,
        `**About ${area.name}:**`,
        '```markdown',
        area.description,
        '```',
    ];

    return new MessageEmbed()
        .setTitle(`${username} would like to travel to ${area.name}.`)
        .setDescription(desc.join('\n'))
        .setFooter('Please confirm by using the reactions below. Travelling to new areas must be a unanimous decision.')
        .setColor('BLUE');
}

export { makeChangeAreaConfirmationMessage }; 