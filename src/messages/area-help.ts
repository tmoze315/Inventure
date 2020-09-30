import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';
import { IGuild } from '../models/Guild';

const makeAreaHelpMessage = (guild: IGuild) => {
    const desc = [
        '`Syntax: -travel <area>`',
        'Travel to a different areas! Unlock more locations by collecting quest items and defeating the area boss.',
        '',
        '**Available areas:**',
    ];

    guild.getUnlockedAreas().forEach((area: IArea) => {
        desc.push(`- ${area.name}`);
    });

    return new MessageEmbed()
        .setDescription(desc.join('\n'))
        .setColor('DARK_BLUE');
}

export { makeAreaHelpMessage }; 