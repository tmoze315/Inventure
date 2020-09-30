import { formatDistance } from 'date-fns';
import { MessageEmbed } from 'discord.js';

const makeCannotSummonBossMessage = (cooldown: Date, now: Date) => {
    const cooldownText = formatDistance(cooldown, now, { includeSeconds: true });

    return new MessageEmbed()
        .setDescription(`Heroes are too exhaused from the last battle with this boss. Try again in ${cooldownText}.`)
        .setColor('DARK_BLUE')
}

export { makeCannotSummonBossMessage };