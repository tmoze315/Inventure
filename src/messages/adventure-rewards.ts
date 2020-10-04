import { EmbedFieldData } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { CurrentAdventure } from "../commands/adventure-commands"
import { IEnemy } from "../interfaces/enemy"
import { PlayerResult } from "../commands/adventure-commands"
import { RewardResult } from '../models/Player';
const makeAdventureRewards = (allPlayerResults: PlayerResult[], allRewardResults: RewardResult[]) => {
    let color = 'DARK_GREEN';

    let desc = [
        `See your rewards below.`,
    ];

     
    // \n💥 Bonus Damage: 301
    let embed = new MessageEmbed()
        .setTitle(`Congratulations heroes, you've secured your bounty!`)
        .setColor(color) // WIN/LOSE colours
        .setDescription(desc.join('\n'))
        for (let i = 0; i < allRewardResults.length; i++) {
        let bonusXpPercentage = new String;
        let bonusGoldPercentage = new String;
        
        if (allRewardResults[i].goldBonusPercentage === 1){
            bonusGoldPercentage = '0%';
        }

        if (allRewardResults[i].goldBonusPercentage === 1.15){
            bonusGoldPercentage = '15%';
        }

        if (allRewardResults[i].goldBonusPercentage === 1.2){
            bonusGoldPercentage = '20%';
        }

        if (allRewardResults[i].xpBonusPercentage === 1){
            bonusXpPercentage = '0%';
        }

        if (allRewardResults[i].xpBonusPercentage === 1.15){
            bonusXpPercentage = '15%';
        }

        if (allRewardResults[i].xpBonusPercentage === 1.2){
            bonusXpPercentage = '20%';
        }

        embed.addFields(
            <EmbedFieldData>{
                name: `${allRewardResults[i].player.username}`,
                value: `🎲 (${allRewardResults[i].goldRoll}) = (${bonusGoldPercentage} Bonus 💰)\n 🎲 (${allRewardResults[i].xpRoll}) = (${bonusXpPercentage} Bonus 📈)\n 💰 **(${allRewardResults[i].totalGold} Gold)** | 📈 **(${allRewardResults[i].totalXp}XP)** `,
                inline: false,
            },
            // Bonus Damage Not Added Yet
        )

    }
        return embed;
}

export { makeAdventureRewards };
