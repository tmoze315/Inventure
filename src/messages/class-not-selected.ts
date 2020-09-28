import { MessageEmbed } from 'discord.js';

const makeClassNotSelectedMessage = (id: string) => {
    return new MessageEmbed()
        .setDescription(`Sorry ${id}! You must be atleast level 10 to select a heroclass! `)
        .setColor('RED');
}

export { makeClassNotSelectedMessage };