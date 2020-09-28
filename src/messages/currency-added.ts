import { MessageEmbed } from 'discord.js';

const makeCurrencyAddedMessage = (id: string, newCurrency: number) => {
    return new MessageEmbed()
        .setDescription(`Success! ${id}'s new balance is $${newCurrency}`)
        .setColor('DARK_GREEN');
}

export { makeCurrencyAddedMessage };