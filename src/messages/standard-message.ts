import { MessageEmbed } from 'discord.js';

const makeStandardMessage = (message: string, color: string = 'DARK_BLUE') => {
    return new MessageEmbed()
        .setDescription(message)
        .setColor(color);
}

export { makeStandardMessage };