import { MessageEmbed } from 'discord.js';

const makeTimeRemainingMessage = (timeRemaining: string, color: string = 'DARK_GREEN') => {
    return new MessageEmbed()
        .setDescription(`⏳ Time remaining: ${timeRemaining}`)
        .setColor(color);
}

export { makeTimeRemainingMessage };