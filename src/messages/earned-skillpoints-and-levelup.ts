import { EmbedFieldData } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { IBoss, IEnemy } from "../interfaces/enemy";
import { PlayerResult } from "../commands/adventure-commands";
import { EarnedSkillpoints } from "../models/Player";

const makeEarnedSkillpoints = (allSkillpointRewards: EarnedSkillpoints[]) => {

    let desc = [
        `Use them wisely.`,
        
    ];

    

    // \n💥 Bonus Damage: 301
    let embed = new MessageEmbed()
        .setColor('DARK_GREEN') // WIN/LOSE colours
    for (let i = 0; i < allSkillpointRewards.length; i++) {
        
        
        let end = 's!';

        if (allSkillpointRewards[i].totalSkillpoints === 1){
            end = '!';         
        }
        
        let fieldValue = `, and you've earned **${allSkillpointRewards[i].totalSkillpoints}** Skillpoint${end}`


        if(allSkillpointRewards[i].totalSkillpoints === 0){
            fieldValue = `!`
        }

        console.log(allSkillpointRewards[i].totalSkillpoints);
        embed.addFields(
            <EmbedFieldData>{
                name: `${allSkillpointRewards[i].player.username}`,
                value: `⏫🌟 Your new level is **${allSkillpointRewards[i].level}**${fieldValue}`,
                inline: false,
            },
            // Bonus Damage Not Added Yet
        )

    }
    return embed;
}

export { makeEarnedSkillpoints };
