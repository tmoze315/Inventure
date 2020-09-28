import { MessageEmbed } from 'discord.js';

const makeCanAdventureMessage = () => {
    return new MessageEmbed()
        .setDescription('Adventurers are now ready to depart!')
        .setColor('DARK_GREEN')
}

export { makeCanAdventureMessage };