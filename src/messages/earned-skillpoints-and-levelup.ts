import { EmbedFieldData } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { IBoss, IEnemy } from "../interfaces/enemy";
import { PlayerResult } from "../commands/adventure-commands";
import { EarnedSkillpoints, LootReward } from "../models/Player";

const makeEarnedSkillpoints = (allSkillpointRewards: EarnedSkillpoints[], allLootRewards: LootReward[]) => {

    let desc = [
        `Use them wisely.`,
        
    ];

    

    // \n💥 Bonus Damage: 301
    let embed = new MessageEmbed()
        .setColor('DARK_GREEN') // WIN/LOSE colours
    for (let i = 0; i < allSkillpointRewards.length; i++) {
        
        
        let end = 's!';
        let chestEnd = 's!'

        if (allSkillpointRewards[i].totalSkillpoints === 1){
            end = '!';         
        }
        
        if(allLootRewards[i].total === 1){
            chestEnd = '!'
        }

        let fieldValue = `, and you've earned **${allSkillpointRewards[i].totalSkillpoints}** Skillpoint${end}`;

        let firstFieldValue = `⏫🌟 Your new level is `;

        if(allSkillpointRewards[i].totalSkillpoints === 0){
            fieldValue = `!`
        }

        if(!allSkillpointRewards[i].levelUp){
            if(allLootRewards[i].total > 0){
                firstFieldValue = `🎁 You've secured **${allLootRewards[i].total}** chest${chestEnd}`;
            }
        }

        if(allSkillpointRewards[i].levelUp){
            if(allLootRewards[i].total > 0){
                firstFieldValue = `⏫🌟 Your new level is **${allSkillpointRewards[i].level}**${fieldValue}\n🎁 You've also secured **${allLootRewards[i].total}** chest${chestEnd}`;
            }
        }

        if(allSkillpointRewards[i].levelUp){
            if(allLootRewards[i].total === 0){
                firstFieldValue = `⏫🌟 Your new level is **${allSkillpointRewards[i].level}**${fieldValue}`;
            }
        }

        console.log(allSkillpointRewards[i].totalSkillpoints);
        embed.addFields(
            <EmbedFieldData>{
                name: `${allSkillpointRewards[i].player.username}`,
                value: `${firstFieldValue}`,
                inline: false,
            },
            // Bonus Damage Not Added Yet
        )

    }
    return embed;
}

export { makeEarnedSkillpoints };
