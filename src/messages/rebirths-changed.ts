import { MessageEmbed } from 'discord.js';

const makeRebirthsChangedMessage = (username: string, newRebirthLevel: number) => {
    return new MessageEmbed()
        .setDescription(`Success! ${username} now has ${newRebirthLevel} rebirths!`)
        .setColor('DARK_GREEN');
}

export { makeRebirthsChangedMessage };