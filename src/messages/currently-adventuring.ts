import { MessageEmbed } from 'discord.js';

const makeCurrentlyAdventuringMessage = () => {
    return new MessageEmbed()
        .setDescription('There is already a battle taking place.')
        .setColor('DARK_BLUE');
}

export { makeCurrentlyAdventuringMessage };