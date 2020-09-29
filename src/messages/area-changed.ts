import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';

const makeAreaChangedMessage = (area: IArea) => {
    return new MessageEmbed()
        .setTitle(`Welcome to ${area.name}`)
        .setDescription(area.description)
        .setColor('DARK_GREEN');
}

export { makeAreaChangedMessage }; 