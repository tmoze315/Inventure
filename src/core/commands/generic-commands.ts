import { Message, MessageEmbed, EmbedFieldData, User } from "discord.js";
import { textChangeRangeIsUnchanged } from "typescript";
import { Player } from '../../models/Player';
import { Reply } from "../Reply";
import BaseCommands from "./base-commands";

class GenericCommands extends BaseCommands {
    // stats([first, last]: [string?, string?]) {
    // Example parameters
    // }

    async start() {
        let player = await Player.findOne({ id: this.user.id }).exec();

        if (player) {
            this.message.channel.send('Looks like you have already started your adventure!');

            return;
        }

        player = new Player({
            id: this.user.id,
            username: this.user.username,
        });

        player.save();

        const reply = new Reply({
            type: 'text',
            body: [
                `**Welcome to Inventure, ${player.get('username')}!**`,
                ``,
                `You appear eager to embark upon your journey. In order to engage your first encounter, please use command \`-adventure\`.`,
                ``,
                `Should you wish to study the lore of this new world you may use command \`-lore\`. `,
                ``,
                `To examine your clothing and armor, you may use command \`-stats\`, and the command \`-backpack\` will allow you to fossick through your bag.`,
            ],
        });

        this.message.channel.send(reply.getContent());
    }

    async stats() {
        const reply = new Reply({
            type: 'text',
            body: [
                `A level **104 Berserker**`,
                `Berserkers have the option to **rage** and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure.`,
                ``,
                `\`\`\`js`,
                `Rebirths: 15`,
                `Max Level: 115`,
                `\`\`\``,
            ],
        });

        const embed = new MessageEmbed()
            // Set the title of the field
            .setTitle(`Character Sheet for: ${this.message.author.username}`)
            .setFooter(`Active bonus: ( 0  | 0  | 0  | 0  | 2  )\nStats: 0% | EXP: 40% | Credits: 0%`)
            // Set the color of the embed
            .setColor('DARK_NAVY')
            // Set the main content of the embed
            .setDescription(reply.getContent())
            .addFields([
                <EmbedFieldData>{
                    name: 'Stats',
                    value: `• Attack: **243** [+53]\n• Charisma: **122** [+0]\n• Intelligence: **124** [+2]`,
                    inline: true,
                },
                <EmbedFieldData>{
                    name: 'Attributes',
                    value: `• Dexterity: **109**\n• Luck: **139**`,
                    inline: true,
                },
            ]);

        this.message.channel.send(embed);
    }
}

export { GenericCommands };
