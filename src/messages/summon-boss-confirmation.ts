import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';

const makeSummonBossConfirmationMessage = (area: IArea, timeRemaining: string) => {
    const desc = [
        `**Are you ready to fight? You have ${timeRemaining} seconds to decide.**`,
        ``,
        `Please confirm by using the reactions below. Decisions must be **unanimous**.`,
    ];

    return new MessageEmbed()
        .setDescription(desc.join('\n'))
        .setColor(area.bossColor);
}

export { makeSummonBossConfirmationMessage }; 