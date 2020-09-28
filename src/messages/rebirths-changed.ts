import { MessageEmbed } from 'discord.js';

const makeRebirthsChangedMessage = (id: string, newRebirthLevel: number) => {
    return new MessageEmbed()
        .setDescription(`Success! ${id} now has ${newRebirthLevel} rebirths!`)
        .setColor('DARK_GREEN');
}

export { makeRebirthsChangedMessage };