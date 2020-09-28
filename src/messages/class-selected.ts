import { MessageEmbed } from 'discord.js';

const makeClassSelectedMessage = (id: string, desiredClass: string) => {
    return new MessageEmbed()
        .setDescription(`Congratulations ${id}! You've selected ${desiredClass}! `)
        .setColor('DARK_GREEN');
}

export { makeClassSelectedMessage };