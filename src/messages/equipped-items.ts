import { MessageEmbed } from 'discord.js';
import { IPlayer } from '../models/Player';
import { IItem } from '../models/Item';


const makeEquippedItemsMessage = async (player: IPlayer) => {
    // TODO: Actually make stats pull from player data
    let allEquippedItems: Array<IItem> = [];
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

    let playerHelmet = await player.get('gear.helmet');
    if (playerHelmet[0] != undefined)
    {
    allEquippedItems.push(playerHelmet[0]);
    }

    let playerGloves = await player.get('gear.gloves');
    if (playerGloves[0] != undefined){
    allEquippedItems.push(playerGloves[0]);
    }

    let playerArmor = await player.get('gear.armor');
    if (playerArmor[0] != undefined){
        allEquippedItems.push(playerArmor[0]);
        }

    let playerWeapon = await player.get('gear.weapon');
    if (playerWeapon[0] != undefined){
        allEquippedItems.push(playerWeapon[0]);
        }

    let playerShield = await player.get('gear.shield');
    if (playerShield[0] != undefined){
        allEquippedItems.push(playerShield[0]);
        }

    let playerBoots = await player.get('gear.boots');
    if (playerBoots[0] != undefined){
        allEquippedItems.push(playerBoots[0]);
        }

    let playerAmulet = await player.get('gear.amulet');
    if (playerAmulet[0] != undefined){
        allEquippedItems.push(playerAmulet[0]);
        }

    let playerRing = await player.get('gear.ring');
    if (playerRing[0] != undefined){
        allEquippedItems.push(playerRing[0]);
        }

    let playerRune = await player.get('gear.rune');
    if (playerRune[0] != undefined){
        allEquippedItems.push(playerRune[0]);
        }

    console.log(allEquippedItems);

    for (let i = 0; i <= allEquippedItems.length; i++) {
        if(allEquippedItems[i] == undefined){
            continue;
        }
        if (allEquippedItems[i].rarity == 'rare' ) {
            allEquippedItems[i].name = `.`+allEquippedItems[i].name.split(' ').join('_');
        }
        if (allEquippedItems[i].rarity == 'epic' ) {
            allEquippedItems[i].name = '['+allEquippedItems[i].name+']';
        }
        if (allEquippedItems[i].rarity == 'legendary' ) {
            allEquippedItems[i].name = `{Legendary: '`+allEquippedItems[i].name+`'}`;
        }
        if (allEquippedItems[i].rarity == 'ascended' ) {
            allEquippedItems[i].name = `{Ascended: ''`+allEquippedItems[i].name+`''}`;
        }
        if (allEquippedItems[i].rarity == 'set' ) {
            allEquippedItems[i].name = `{Ascended: ''`+allEquippedItems[i].name+`''}`;
        }
    }


        let longest = '';
        for (let i = 0; i < allEquippedItems.length; i++) {
            
            if(allEquippedItems[i] == undefined){
                continue;
            }

            if (allEquippedItems[i].name.length > longest.length) {
                longest = allEquippedItems[i].name;
            }
        }

        

        const longestLength = longest.length;

        const insideSpace = longestLength + 5;

        console.log(longestLength);

        
    


    for (let i = 0; i < allEquippedItems.length; i++) {
        let tempArray: Array<String> = [];
        let finalSpace = '';

        let attSpace = '  ';
        let chaSpace = '  ';
        let intSpace = '  ';
        let dexSpace = '  ';
        let luckSpace = '  ';

        for (let j = 0; j < (insideSpace - allEquippedItems[i].name.length); j++) {
            finalSpace = ' ' + finalSpace; 
        } 



        if (allEquippedItems[i].stats.attack.toLocaleString().length === 1)
        {
            attSpace = '  ';
        }
        if (allEquippedItems[i].stats.attack.toLocaleString().length === 2)
        {
            attSpace = ' ';
        }
        if (allEquippedItems[i].stats.attack.toLocaleString().length === 3)
        {
            attSpace = '';
        }
        
        if (allEquippedItems[i].stats.charisma.toLocaleString().length === 1)
        {
            chaSpace = '  ';
        }
        if (allEquippedItems[i].stats.charisma.toLocaleString().length === 2)
        {
            chaSpace = ' ';
        }
        if (allEquippedItems[i].stats.charisma.toLocaleString().length === 3)
        {
            chaSpace = '';
        } 

        if (allEquippedItems[i].stats.intelligence.toLocaleString().length === 1)
        {
            intSpace = '  ';
        }
        if (allEquippedItems[i].stats.intelligence.toLocaleString().length === 2)
        {
            intSpace = ' ';
        }
        if (allEquippedItems[i].stats.intelligence.toLocaleString().length === 3)
        {
            intSpace = '';
        } 

        if (allEquippedItems[i].stats.dexterity.toLocaleString().length === 1)
        {
            dexSpace = '  ';
        }
        if (allEquippedItems[i].stats.dexterity.toLocaleString().length === 2)
        {
            dexSpace = ' ';
        }
        if (allEquippedItems[i].stats.dexterity.toLocaleString().length === 3)
        {
            dexSpace = '';
        } 

        if (allEquippedItems[i].stats.luck.toLocaleString().length === 1)
        {
            luckSpace = '  ';
        }
        if (allEquippedItems[i].stats.luck.toLocaleString().length === 2)
        {
            luckSpace = ' ';
        }
        if (allEquippedItems[i].stats.luck.toLocaleString().length === 3)
        {
            luckSpace = '';
        } 
        

        if(allEquippedItems[i].slot == 'head')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedHeadItems.push(item);    
        }
        if(allEquippedItems[i].slot == 'neck')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedNeckItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'chest')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedChestItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'gloves')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedGlovesItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'belt')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedBeltItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'legs')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedLegsItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'boots')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedBootsItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'left')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedLeftItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'right')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedRightItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'two handed')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedTwoHandedItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'ring')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
            sortedRingItems.push(item); 
        }
        if(allEquippedItems[i].slot == 'charm')
        {
            let item = `${allEquippedItems[i].name}${finalSpace}- (${attSpace}${allEquippedItems[i].stats.attack}  |${chaSpace}${allEquippedItems[i].stats.charisma}  |${intSpace}${allEquippedItems[i].stats.intelligence}  |${dexSpace}${allEquippedItems[i].stats.dexterity}  |${luckSpace}${allEquippedItems[i].stats.luck}  ) | Lvl 1 (TODO)    | 1 | Set Skrrtis (2pcs)(TODO)\n`;                                    
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
        `${player.username}'s equipped items`,
        ``,
        `Currently Equipped Gear:`,
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

export { makeEquippedItemsMessage };