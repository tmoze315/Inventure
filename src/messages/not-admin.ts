import { MessageEmbed } from 'discord.js';

const makeNotAdminMessage = (name: string) => {
    return new MessageEmbed()
        .setDescription(`Sorry ${name}, you are not an administrator!`)
        .setColor('RED');
}

export { makeNotAdminMessage };