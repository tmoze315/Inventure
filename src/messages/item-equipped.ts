import { MessageEmbed } from 'discord.js'; 
import { IItem } from '../models/Item';
import { IPlayer } from '../models/Player';

const makeItemEquippedMessage = (item: IItem, player: IPlayer) => {
    return new MessageEmbed()
        .setDescription(`Great choice ${player.username}! You've equipped your ${item.name}.`)
        .setColor('DARK_GREEN');
}

export { makeItemEquippedMessage };