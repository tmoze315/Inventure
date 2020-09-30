import { MessageEmbed } from 'discord.js';

const makeStandardMessage = (message: string) => {
    return new MessageEmbed()
        .setDescription(message)
        .setColor('DARK_BLUE');
}

export { makeStandardMessage };