import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';
import { IBoss } from '../interfaces/enemy';

const makeSummonBossMessage = (username: string, area: IArea) => {
    const boss: IBoss = area.getBoss();

    const desc = [
        `\`\`\`yaml`,
        ``,
        `⚠️ Warning: ⚠️`,
        `Extremely Strong enemy detected up ahead!`,
        ``,
        `\`\`\``,
        ``,
        `${username} wants to summon **${boss.name}**:`,
        ``,
        `_${boss.description}_`,
    ];

    return new MessageEmbed()
        .setTitle(`You are about to summon a boss. Are you ready?`)
        .setDescription(desc.join('\n'))
        .setThumbnail(boss.image)
        .setColor(area.bossColor);
}

export { makeSummonBossMessage }; 