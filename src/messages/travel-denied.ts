import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';

const makeTravelDeniedMessage = (area: IArea) => {
    return new MessageEmbed()
        .setDescription(`You decided not to travel to ${area.name}.`)
        .setColor('DARK_RED')
}

export { makeTravelDeniedMessage };