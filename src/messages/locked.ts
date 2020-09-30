import { MessageEmbed } from 'discord.js';

const makeLockedMessage = () => {
    return new MessageEmbed()
        .setDescription('You are currently too preocupied to do this.')
        .setColor('DARK_RED');
}

export { makeLockedMessage };