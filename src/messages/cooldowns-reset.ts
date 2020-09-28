import { MessageEmbed } from 'discord.js';

const makeCooldownsResetMessage = () => {
    return new MessageEmbed()
        .setDescription('Success! Cooldowns have been reset.')
        .setColor('DARK_GREEN');
}

export { makeCooldownsResetMessage };