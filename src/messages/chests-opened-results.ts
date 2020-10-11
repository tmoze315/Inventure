import { EmbedFieldData } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { IBoss, IEnemy } from "../interfaces/enemy";
import { IItem } from "../models/Item"
import { PlayerResult } from "../commands/adventure-commands";
import { EarnedSkillpoints, LootReward, ItemGenerationResult } from "../models/Player";

const makeChestsOpenedResultsMessage = (allChestsResults: ItemGenerationResult) => {

    let desc = [
        `Looks like the gods are on your side! See what you've acquired below.`,
        
    ];



    let embed = new MessageEmbed()
        .setColor('GOLD') 
        .setTitle('Loot Results:')
        .setDescription(desc.join('\n'))
    for (let i = 0; i < allChestsResults.items.length; i++) {
         let beginning = 'A';

         if (allChestsResults.items[i].rarity == 'ascended' || allChestsResults.items[i].rarity == 'epic')
         {
            beginning = 'An';
         }


        embed.addFields(
            <EmbedFieldData>{
                name: `${allChestsResults.items[i].name}`,
                value: `${beginning} ${allChestsResults.items[i].rarity} ${allChestsResults.items[i].slot} piece!`,
                inline: false,
            },
            // Bonus Damage Not Added Yet
        )

    }
    return embed;
}

export { makeChestsOpenedResultsMessage };
