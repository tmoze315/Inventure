import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';

const makeCurrentAreaMessage = (area: IArea) => {
    return new MessageEmbed()
        .setTitle(`You are in ${area.name}`)
        .setDescription(`${area.emoji} - _${area.description}_`)
        .setColor(area.color);
}

export { makeCurrentAreaMessage }; 