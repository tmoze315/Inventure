import { MessageEmbed } from 'discord.js';

const makeInsufficientSkillpointsMessage = (id: string) => {
    return new MessageEmbed()
        .setDescription(`Sorry ${id}! You don't have enough skillpoints!`)
        .setColor('RED');
}

export { makeInsufficientSkillpointsMessage };