import { MessageEmbed } from 'discord.js';
import { IArea } from '../areas/base-area';
import { IGuild } from '../models/Guild';
import AreaService from '../services/AreaService';

const makeAreaHelpMessage = (guild: IGuild) => {
    const desc = [
        'Travel to a different areas. Unlock more locations by collecting quest items and defeating the area boss.',
        ``,
        '```css',
        'Syntax: -travel <area>',
        '```',
        '',
        '**Areas:**',
    ];

    const unlockedAreas = guild.getUnlockedAreas().map((area: IArea) => {
        return area.key;
    });

    AreaService.getAllAreas().forEach((area: IArea) => {
        const isCurrentArea = guild.get('currentArea') === area.key;

        if (unlockedAreas.includes(area.key)) {
            desc.push(`${area.emoji} - **${area.name}**${isCurrentArea ? ' [Current area]' : ''}\n_${area.description}_\n`);
        } else {
            desc.push(`❓ - (undiscovered)\n`);
        }
    });

    return new MessageEmbed()
        .setDescription(desc.join('\n'))
        .setColor('DARK_BLUE');
}

export { makeAreaHelpMessage }; 