import { MessageEmbed } from 'discord.js';

const makeAdminMessage = (id: string) => {
    return new MessageEmbed()
        .setDescription(`Success! ${id} is now an administrator!`)
        .setColor('DARK_GREEN');
}

export { makeAdminMessage };