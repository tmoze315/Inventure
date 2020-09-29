import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';

const makeChangeAreaConfirmationMessage = (username: string, area: IArea) => {
    const desc = [
        `${username} would like to travel to ${area.name}.`,
        `Please confirm by using the reactions below. Travelling to new areas must be a unanimous decision.`,
        `This will cost your guild ${area.travelCost} gold`,
    ];
    return new MessageEmbed()
        .setDescription(desc.join('\n'))
        .setColor('DARK_BLUE');
}

export { makeChangeAreaConfirmationMessage }; 