import { MessageEmbed } from 'discord.js';

const makeErrorMessage = (message: string) => {
    return new MessageEmbed()
        .setDescription(message)
        .setColor('DARK_RED');
}

export { makeErrorMessage };