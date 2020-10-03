import { MessageEmbed } from 'discord.js';

const makeRebirthFailureMessage = (id: string, maxLevel: number) => {
    return new MessageEmbed()
        .setDescription(`Sorry ${id}! You must be level ${maxLevel} in order to rebirth!`)
        .setColor('RED');
}

export { makeRebirthFailureMessage };