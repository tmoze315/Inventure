import { MessageEmbed } from 'discord.js';

const makeUnbannedMessage = (id: string) => {
    return new MessageEmbed()
        .setDescription(`Success! ${id} has been un-banned`)
        .setColor('DARK_GREEN');
}

export { makeUnbannedMessage }; 