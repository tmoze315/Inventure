import { MessageEmbed } from 'discord.js';

const makeInsufficientFundsClassNotSelectedMessage = (id: string, requiredAmount: number) => {
    return new MessageEmbed()
        .setDescription(`Sorry ${id}! You need $${requiredAmount} to select a heroclass!`)
        .setColor('RED');
}

export { makeInsufficientFundsClassNotSelectedMessage }; 