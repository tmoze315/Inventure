import { Message, MessageEmbed, EmbedFieldData } from "discord.js";

class AvailableCommands {
    constructor(private message: Message) { }

    // stats([first, last]: [string?, string?]) {
    //     this.message.channel.send('Starting your adventure!');
    // }

    stats() {
        const embed = new MessageEmbed()
            // Set the title of the field
            .setTitle(`Character Sheet for: ${this.message.author.username}`)
            .setFooter(`Active bonus: ( 0  | 0  | 0  | 0  | 2  )\nStats: 0% | EXP: 40% | Credits: 0%`)
            // Set the color of the embed
            .setColor('DARK_NAVY')
            // Set the main content of the embed
            .setDescription(`A level **104 Berserker**

            Berserkers have the option to **rage** and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure.

            \`\`\`js
Rebirths: 15
Max Level: 115
\`\`\`
`)
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

export { AvailableCommands };
