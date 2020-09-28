import { formatDistance } from 'date-fns';
import { MessageEmbed } from 'discord.js';

const makeCannotAdventureMessage = (cooldown: Date, now: Date) => {
    const cooldownText = formatDistance(cooldown, now, { includeSeconds: true });

    return new MessageEmbed()
        .setDescription(`No heroes are ready to depart in an adventure. Try again in ${cooldownText}.`)
        .setColor('DARK_BLUE')
}

export { makeCannotAdventureMessage };