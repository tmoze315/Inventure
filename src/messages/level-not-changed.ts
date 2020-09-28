import { MessageEmbed } from 'discord.js';

const makeLevelNotChangedMessage = (id: string, newLevel: number) => {
    return new MessageEmbed()
        .setDescription(`Failed to change ${id}'s level`)
        .setColor('RED');
}

export { makeLevelNotChangedMessage };