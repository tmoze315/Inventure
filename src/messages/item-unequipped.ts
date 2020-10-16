import { MessageEmbed } from 'discord.js'; 
import { IItem } from '../models/Item';
import { IPlayer } from '../models/Player';

const makeItemUnequippedMessage = (item: IItem, player: IPlayer) => {
    return new MessageEmbed()
        .setDescription(`Time for an upgrade, ${player.username}! You've unequipped your ${item.name}.`)
        .setColor('DARK_GREEN');
}

export { makeItemUnequippedMessage };