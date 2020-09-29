import { MessageEmbed } from 'discord.js';

const makeAdventureInProgressMessage = () => {
    return new MessageEmbed()
        .setDescription('Sorry, I cannot do that for you right now. There is a battle currently taking place.')
        .setColor('DARK_RED');
}

export { makeAdventureInProgressMessage };