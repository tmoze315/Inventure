import { MessageEmbed } from 'discord.js';
import { IPlayer } from '../models/Player';
import { IItem } from '../models/Item';


const makeBackpackMessage = (player: IPlayer, backpack: IItem[]) => {
    // TODO: Actually make stats pull from player data
    let originalSortedBackpack = backpack;

    if(originalSortedBackpack.length <= 0)
    {
        return;
    }

    for (let i = 0; i < originalSortedBackpack.length; i++) {
        if (originalSortedBackpack[i].rarity == 'rare' ) {
            originalSortedBackpack[i].name = `.`+originalSortedBackpack[i].name.split(' ').join('_');
        }
        if (originalSortedBackpack[i].rarity == 'epic' ) {
            originalSortedBackpack[i].name = '['+originalSortedBackpack[i].name+']';
        }
        if (originalSortedBackpack[i].rarity == 'legendary' ) {
            originalSortedBackpack[i].name = `{Legendary: '`+originalSortedBackpack[i].name+`'}`;
        }
        if (originalSortedBackpack[i].rarity == 'ascended' ) {
            originalSortedBackpack[i].name = `{Ascended: ''`+originalSortedBackpack[i].name+`''}`;
        }
        if (originalSortedBackpack[i].rarity == 'set' ) {
            originalSortedBackpack[i].name = `{Ascended: ''`+originalSortedBackpack[i].name+`''}`;
        }
    }


    let sortedBackpack = backpack;

    // console.log(sortedBackpack);

    let sortedHeadItems: Array<String> = [];
    let sortedNeckItems: Array<String> = [];
    let sortedChestItems: Array<String> = []; 
    let sortedGlovesItems: Array<String> = [];
    let sortedBeltItems: Array<String> = []; 
    let sortedLegsItems: Array<String> = [];
    let sortedBootsItems: Array<String> = []; 
    let sortedLeftItems: Array<String> = []; 
    let sortedRightItems: Array<String> = []; 
    let sortedTwoHandedItems: Array<String> = []; 
    let sortedRingItems: Array<String> = []; 
    let sortedCharmItems: Array<String> = []; 

        let longest = sortedBackpack[0].name;
        for (let i = 1; i < sortedBackpack.length; i++) {
            if (sortedBackpack[i].name.length > longest.length) {
                longest = sortedBackpack[i].name;
            }
        }

        const longestLength = longest.length;

        const insideSpace = longestLength + 5;

        

        
    


    for (let i = 0; i < sortedBackpack.length; i++) {
        let tempArray: Array<String> = [];
        let finalSpace = '';

        let attSpace = '  ';
        let chaSpace = '  ';
        let intSpace = '  ';
        let dexSpace = '  ';
        let luckSpace = '  ';

        for (let j = 0; j < (insideSpace - sortedBackpack[i].name.length); j++) {
            finalSpace = ' ' + finalSpace; 
        } 



        if (sortedBackpack[i].stats.attack.toLocaleString().length === 1)
        {
            attSpace = '  ';
        }
        if (sortedBackpack[i].stats.attack.toLocaleString().length === 2)
        {
            attSpace = ' ';
        }
        if (sortedBackpack[i].stats.attack.toLocaleString().length === 3)
        {
            attSpace = '';
        }
        
        if (sortedBackpack[i].stats.charisma.toLocaleString().length === 1)
        {
            chaSpace = '  ';
        }
        if (sortedBackpack[i].stats.charisma.toLocaleString().length === 2)
        {
            chaSpace = ' ';
        }
        if (sortedBackpack[i].stats.charisma.toLocaleString().length === 3)
        {
            chaSpace = '';
        } 

        if (sortedBackpack[i].stats.intelligence.toLocaleString().length === 1)
        {
            intSpace = '  ';
        }
        if (sortedBackpack[i].stats.intelligence.toLocaleString().length === 2)
        {
            intSpace = ' ';
        }
        if (sortedBackpack[i].stats.intelligence.toLocaleString().length === 3)
        {
            intSpace = '';
        } 

        if (sortedBackpack[i].stats.dexterity.toLocaleString().length === 1)
        {
            dexSpace = '  ';
        }
        if (sortedBackpack[i].stats.dexterity.toLocaleString().length === 2)
        {
            dexSpace = ' ';
        }
        if (sortedBackpack[i].stats.dexterity.toLocaleString().length === 3)
        {
            dexSpace = '';
        } 

        if (sortedBackpack[i].stats.luck.toLocaleString().length === 1)
        {
            luckSpace = '  ';
        }
        if (sortedBackpack[i].stats.luck.toLocaleString().length === 2)
        {
            luckSpace = ' ';
        }
        if (sortedBackpack[i].stats.luck.toLocaleString().length === 3)
        {
            luckSpace = '';
        } 
        

        if(sortedBackpack[i].slot == 'head')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedHeadItems.push(item);    
        }
        if(sortedBackpack[i].slot == 'neck')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedNeckItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'chest')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedChestItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'gloves')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedGlovesItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'belt')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedBeltItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'legs')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedLegsItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'boots')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedBootsItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'left')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedLeftItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'right')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedRightItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'two handed')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedTwoHandedItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'ring')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedRingItems.push(item); 
        }
        if(sortedBackpack[i].slot == 'charm')
        {
            let item = `${sortedBackpack[i].name}${finalSpace}- (${attSpace}${sortedBackpack[i].stats.attack}  |${chaSpace}${sortedBackpack[i].stats.charisma}  |${intSpace}${sortedBackpack[i].stats.intelligence}  |${dexSpace}${sortedBackpack[i].stats.dexterity}  |${luckSpace}${sortedBackpack[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedCharmItems.push(item); 
        }
      }

    //  const tableHeadItems = table(sortedHeadItems, {align: [ 'l']});
    //  const tableNeckItems = table(sortedNeckItems, {align: [ 'l']});
    //  const tableChestItems = table(sortedChestItems, {align: [ 'l']});
    //  const tableGlovesItems = table(sortedGlovesItems, {align: [ 'l']});
    //  const tableBeltItems = table(sortedBeltItems, {align: [ 'l']});
    //  const tableLegsItems = table(sortedLegsItems, {align: [ 'l']});
    //  const tableBootsItems = table(sortedBootsItems, {align: [ 'l']});
    //  const tableLeftItems = table(sortedLeftItems, {align: [ 'l',]});
    //  const tableRightItems = table(sortedRightItems, {align: [ 'l']});
    //  const tableTwoHandedItems = table(sortedTwoHandedItems, {align: [ 'l']});
    //  const tableRingItems = table(sortedRingItems, {align: [ 'l']});
    //  const tableCharmItems = table(sortedCharmItems, {align: [ 'l']});
      
      


    const message = [
        `\`\`\`css`,
        `${player.username}'s backpack`,
        ``,
        `Items in Backpack:`,
        `+=====+=====+=====+=====+======+=+===========+============+=======+================+`,
        `( ATT | CHA | INT | DEX | LUCK ) | LEVEL REQ | [DEGRADE#] | OWNED | SET (SET PIECES)`,
        `+=====+=====+=====+=====+======+=+===========+============+=======+================+`,
        ``,
        `Head Slot`,
        ``,
        `${sortedHeadItems.join("")}`,
        ``,
        `Neck Slot`,
        ``,
        `${sortedNeckItems.join("")}`,
        ``,
        `Chest Slot`,
        ``,
        `${sortedChestItems.join("")}`,
        ``,
        `Gloves Slot`,
        ``,
        `${sortedGlovesItems.join("")}`,
        ``,
        `Belt Slot`,
        ``,
        `${sortedBeltItems.join("")}`,
        ``,
        `Legs Slot`,
        ``,
        `${sortedLegsItems.join("")}`,
        ``,
        `Boots Slot`,
        ``,
        `${sortedBootsItems.join("")}`,
        ``,
        `Left Slot`,
        ``,
        `${sortedLeftItems.join("")}`,
        ``,
        `Right Slot`,
        ``,
        `${sortedRightItems.join("")}`,
        ``,
        `Two Handed Slot`,
        ``,
        `${sortedTwoHandedItems.join("")}`,
        ``,
        `Ring Slot`,
        ``,
        `${sortedRingItems.join("")}`,
        ``,
        `Charm Slot`,
        `${sortedCharmItems.join("")}`,
        ``,
        `Active bonuses: ( 0  | 0  | 0  | 0  | 0  ) - Attributes: 0% | EXP: 0% | Credits: 0% (TODO)`,
        `\`\`\``,
    ];
    // console.log(message);
    // return desc.join('\n');
    return message
};

export { makeBackpackMessage };