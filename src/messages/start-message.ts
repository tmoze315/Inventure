import { MessageEmbed } from 'discord.js';

const makeStartMessage = (username: string) => {
    const desc = [
        `**Welcome to Inventure, ${username}!**`,
        ``,
        `You appear eager to embark upon your journey. In order to engage your first encounter, please use command \`-adventure\`.`,
        ``,
        `Should you wish to study the lore of this new world you may use command \`-lore\`. `,
        ``,
        `To examine your clothing and armor, you may use command \`-stats\`, and the command \`-backpack\` will allow you to fossick through your bag.`,
    ];

    return new MessageEmbed()
        .setDescription(desc.join('\n'))
        .setColor('DARK_BLUE');
}

export { makeStartMessage };