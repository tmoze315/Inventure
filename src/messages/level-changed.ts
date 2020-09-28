import { MessageEmbed } from 'discord.js';

const makeLevelChangedMessage = (id: string, newLevel: number) => {
    return new MessageEmbed()
        .setDescription(`Success! ${id}'s new level is ${newLevel}`)
        .setColor('DARK_GREEN');
}

export { makeLevelChangedMessage };