import { MessageEmbed } from 'discord.js';
import { IPlayer } from '../models/Player';

const makeStatsMessage = (player: IPlayer) => {
    let nextLevel = player.get('level') + 1;
    const maxLevel = player.get('maxLevel');

    if (nextLevel > maxLevel) {
        nextLevel = maxLevel;
    }

    const desc = [
        player.getHeroClassDescription(),
        ``,
        `**Attributes**`,
        `\`\`\`css`,
        `{ Rebirths: ${player.getRebirths()} }`,
        `{ Max-Level: ${player.getMaxLevel()} }`,
        ``,
        `- Attack: ${player.getStat('attack')} [+${player.getSkillpoint('attack')}]`,
        `- Charisma: ${player.getStat('charisma')} [+${player.getSkillpoint('charisma')}]`,
        `- Intelligence: ${player.getStat('intelligence')} [+${player.getSkillpoint('intelligence')}]`,
        ``,
        `- Dexterity: ${player.getStat('dexterity')}`,
        `- Luck: ${player.getStat('luck')}`,
        `\`\`\``,
        ``,
        `**Extra information**`,
        `\`\`\`css`,
        `- Currency: ${player.get('currency').toLocaleString()}`,
        `- Experience: ${player.get('experience').toLocaleString()}/${player.getExperienceNeededForLevel(nextLevel).toLocaleString()}`,
        `- Unspent Skillpoints: ${player.getSkillpoint('unspent')} `,
        `\`\`\``,
    ];

    return new MessageEmbed()
        .setTitle(`A level ${player.getLevel()} ${player.getHeroClass()}`)
        .setDescription(desc.join('\n'))
        .setThumbnail(player.getHeroClassThumbnail())
        .setFooter('Active bonuses: ( 0  | 0  | 0  | 0  | 0  ) - Attributes: 0% | EXP: 0% | Credits: 0% (TODO)');
};

export { makeStatsMessage };