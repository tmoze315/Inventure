
import { MessageEmbed } from 'discord.js';

const makeXPLevelChangedMessage = (id: string, newXPLevel: number) => {
    return new MessageEmbed()
        .setDescription(`Success! ${id}'s new experience amount is ${newXPLevel}`)
        .setColor('DARK_GREEN');
}

export { makeXPLevelChangedMessage }; 