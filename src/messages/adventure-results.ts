import { EmbedFieldData } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { IBoss, IEnemy } from "../interfaces/enemy"
import { PlayerResult } from "../commands/adventure-commands"
const makeAdventureResults = (won: boolean, enemy: IEnemy | IBoss, absoluteDamge: number, allPlayerResults: PlayerResult[]) => {
    let color = 'DARK_GREEN';

    let desc = [
        `The group killed the ${enemy.name} **(${absoluteDamge}/${enemy.baseHp})**.`,
        `TODO: Make this clever`,
    ];

    if (!won) {
        color = 'DARK_RED';

        desc = [
            `The group got killed by the ${enemy.name} **(${absoluteDamge}/${enemy.baseHp})**.`,
            `TODO: Make this clever`,
        ];
    }

    // \n💥 Bonus Damage: 301
    let embed = new MessageEmbed()
        .setColor(color) // WIN/LOSE colours
        .setDescription(desc.join('\n'))
    for (let i = 0; i < allPlayerResults.length; i++) {

        let emoji = new String;


        if (allPlayerResults[i].action === 'attack') {
            emoji = '⚔️';
        }
        if (allPlayerResults[i].action === 'spell') {
            emoji = '✨';
        }
        if (allPlayerResults[i].action === 'run') {
            emoji = '🏃‍♂️';
        }

        embed.addFields(
            <EmbedFieldData>{
                name: `${allPlayerResults[i].player.username}`,
                value: `🎲 (${allPlayerResults[i].roll}) + ${emoji} (${allPlayerResults[i].baseDamage}) = 💥 (${allPlayerResults[i].totalDamage})`,
                inline: false,
            },
            // Bonus Damage Not Added Yet
        )

    }
    return embed;
}

export { makeAdventureResults };
