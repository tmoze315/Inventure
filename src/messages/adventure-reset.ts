import { MessageEmbed } from 'discord.js';

const makeAdventureResetMessage = () => {
    return new MessageEmbed()
        .setDescription('Success! Adventure has been reset.')
        .setColor('DARK_GREEN');
}

export { makeAdventureResetMessage };