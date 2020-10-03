import { MessageEmbed } from 'discord.js';

const makeRebirthSuccessMessage = (id: string, maxLevel: number) => {
    return new MessageEmbed()
        .setDescription(`Congratulations ${id}! You've rebirthed! Your new max level is ${maxLevel} `)
        .setColor('DARK_GREEN');
}

export { makeRebirthSuccessMessage };