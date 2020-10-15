import { MessageEmbed } from 'discord.js';
import { IPlayer } from '../models/Player';

const makeHeroclassHelpMessage = (player: IPlayer) => {
    const desc = [
        `So you think you're read to choose a class ${player.username}?`,
        ``,
        '```css',
        'Syntax: -heroclass <name>',
        '```',
        '',
        '**Hero Classes:**',
        `**Berserker**${player.class === 'Berserker' ? ' [Current class]' : ''}\n_Berserkers have the option to rage and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure._\n`,
        `**Wizard**${player.class === 'Wizard' ? ' [Current class]' : ''}\n_Wizards have the option to focus and add large bonuses to their magic, but their focus can sometimes go astray...\nUse the focus command when attacking in an adventure._\n`,
        `**Ranger**${player.class === 'Ranger' ? ' [Current class]' : ''}\n_Rangers can gain a special pet, which can find items and give reward bonuses.\nUse the pet command to see pet options._\n`,
        `**Tinkerer**${player.class === 'Tinkerer' ? ' [Current class]' : ''}\n_Tinkerers can forge two different items into a device bound to their very soul.\nUse the forge command._\n`,
        `**Cleric**${player.class === 'Cleric' ? ' [Current class]' : ''}\n_Clerics can bless the entire group when praying.\nUse the bless command when fighting in an adventure._\n`,
    ];

    return new MessageEmbed()
        .setDescription(desc.join('\n'))
        .setColor('DARK_BLUE');
}

export { makeHeroclassHelpMessage };