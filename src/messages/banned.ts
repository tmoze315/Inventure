import { MessageEmbed } from 'discord.js';

const makeBannedMessage = (id: string) => {
    return new MessageEmbed()
        .setDescription(`Success! ${id} has been banned`)
        .setColor('DARK_GREEN');
}

export { makeBannedMessage }; 