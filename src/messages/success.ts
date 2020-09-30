import { MessageEmbed } from 'discord.js';

const makeSuccessMessage = (message: string) => {
    return new MessageEmbed()
        .setDescription(message)
        .setColor('DARK_GREEN');
}

export { makeSuccessMessage };