import { MessageEmbed } from 'discord.js';

const makeAdventureNotResetMessage = () => {
    return new MessageEmbed()
        .setDescription('Failed to reset adventure! There is no battle occuring.')
        .setColor('RED');
}

export { makeAdventureNotResetMessage };