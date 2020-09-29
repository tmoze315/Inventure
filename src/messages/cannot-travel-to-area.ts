import { MessageEmbed } from 'discord.js';

const makeCannotTravelToAreaMessage = () => {
    return new MessageEmbed()
        .setDescription('Sorry, that area either does not exist or you have not unlocked it yet')
        .setColor('DARK_RED');
}

export { makeCannotTravelToAreaMessage }; 