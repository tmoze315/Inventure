import { Schema, model, Document } from 'mongoose';
import { IEnemy } from '../interfaces/enemy';
import { Item, ItemSchema } from './Item';
import { PlayerAttack } from '../commands/adventure-commands';
import { IArea } from '../areas/base-area';
import { makeEarnedSkillpoints } from '../messages/earned-skillpoints-and-levelup';
import { IItem } from '../models/Item'
import { isIterationStatement } from 'typescript';
import _ from 'lodash';


interface IPlayer extends Document {
    id: string,
    guildId: string,
    username: string,
    isAdmin: Boolean,
    class: string,
    background: string,
    experience: number,
    level: number,
    maxLevel: number,
    rebirths: number,
    currency: number,
    getLevel: Function,
    getHeroClass: Function,
    getHeroClassDescription: Function,
    getHeroClassThumbnail: Function,
    getRebirths: Function,
    getMaxLevel: Function,
    getStat: Function,
    getSkillpoint: Function,
    getIdFromName: Function,
    hasBeenBanned: Function,
    setExperience: Function,
    setLevel: Function,
    setRebirths: Function,
    setHeroClass: Function,
    addCurrency: Function,
    giveExperience: Function,
    makeAdmin: Function,
    ban: Function,
    unban: Function,
    attackEnemy: Function,
    getCritAmount: Function,
    handleExperience: Function,
    gainXpAfterKillingEnemy: Function,
    rebirth: Function,
    removeCurrency: Function,
    gainGoldAfterKillingEnemy: Function,
    loseGoldAfterLosingToEnemy: Function,
    getExperienceNeededForLevel: Function,
    getLevelForCurrentExperience: Function,
    postBattleRewards: Function,
    handleSkillpointRewards: Function,
    useSkillpoints: Function,
    makeItem: Function,
    clearBag: Function,
    postBattleLootRewards: Function,
    giveChest: Function,
    returnLoot: Function,
    returnBackpack: Function,
    sortBackpack: Function,
    equip: Function,
    unequipItemExternal: Function,
}

interface RewardResult {
    player: IPlayer,
    xpRoll: number,
    goldRoll: number,
    xpBonusPercentage: number,
    goldBonusPercentage: number,
    baseGold: number,
    baseXp: number,
    totalGold: number,
    totalXp: number,
}

interface EarnedSkillpoints {
    player: IPlayer,
    level: number,
    totalSkillpoints: number,
    levelUp: boolean,
}

interface SkillpointResults{
    player: IPlayer,
    finalPoints: number,
    skill: string,
    worked: boolean,
}

interface LootReward{
    player: IPlayer,
    normal: number,
    rare: number,
    epic: number,
    legendary: number,
    ascended: number,
    set: number,
    total: number,
}

interface ItemGenerationResult{
    items: Array<IItem>,
    enough: boolean,
};


const PlayerSchema = new Schema({
    id: {
        type: String,
        index: true,
    },
    guildId: {
        type: String,
    },
    username: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    class: {
        type: String,
        default: null,
    },
    background: {
        type: String,
        default: null,
    },
    currency: {
        type: Number,
        default: 1000,
        min: 0,
    },
    experience: {
        type: Number,
        default: 0,
        min: 0,
    },
    level: {
        type: Number,
        default: 1,
        min: 0,
    },
    maxLevel: {
        type: Number,
        default: 10,
        min: 0,
    },
    rebirths: {
        type: Number,
        default: 0,
        min: 0,
    },
    skillpoints: {
        unspent: {
            type: Number,
            default: 0,
            min: 0,
        },
        attack: {
            type: Number,
            default: 0,
            min: 0,
        },
        intelligence: {
            type: Number,
            default: 0,
            min: 0,
        },
        charisma: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    stats: {
        attack: {
            type: Number,
            default: 1,
            min: 0,
        },
        intelligence: {
            type: Number,
            default: 1,
            min: 0,
        },
        charisma: {
            type: Number,
            default: 1,
            min: 0,
        },
        luck: {
            type: Number,
            default: 1,
            min: 0,
        },
        dexterity: {
            type: Number,
            default: 1,
            min: 0,
        },
    },
    battle: {
        hasUsedAbility: {
            type: Boolean,
            default: false,
        },
        cooldown: Date,
    },
    loot: {
        normal: {
            type: Number,
            default: 0,
            min: 0,
        },
        rare: {
            type: Number,
            default: 0,
            min: 0,
        },
        epic: {
            type: Number,
            default: 0,
            min: 0,
        },
        legendary: {
            type: Number,
            default: 0,
            min: 0,
        },
        ascended: {
            type: Number,
            default: 0,
            min: 0,
        },
        sets: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    gear: {
        helmet: [ItemSchema],
        gloves: [ItemSchema],
        armor: [ItemSchema],
        weapon: [ItemSchema],
        shield: [ItemSchema],
        boots: [ItemSchema],
        amulet: [ItemSchema],
        ring: [ItemSchema],
        rune: [ItemSchema],
    },
    backpack: [ItemSchema],
    adventures: {
        wins: {
            type: Number,
            default: 0,
            min: 0,
        },
        losses: {
            type: Number,
            default: 0,
            min: 0,
        },
    }
});

PlayerSchema.methods.getLevel = function () {
    return this.get('level') || 1;
};

PlayerSchema.methods.getHeroClass = function (): string {
    return this.get('class') || 'Hero';
};

PlayerSchema.methods.setHeroClass = function (heroClass: string) {
    heroClass = heroClass.toLowerCase();
    const newHeroClass = heroClass.charAt(0).toUpperCase() + heroClass.slice(1).trim();
    const options: Array<String> = ['Berserker', 'Wizard', 'Ranger', 'Cleric', 'Tinkerer'];

    if (!options.includes(newHeroClass)) {
        throw new Error('Invalid hero class');
    }

    this.class = newHeroClass;

    return this.save();
};

PlayerSchema.methods.getStat = function (stat: string): number {
    return this.get('stats')[stat] || 0;
};

PlayerSchema.methods.getSkillpoint = function (skillpoint: string) {
    return this.get('skillpoints')[skillpoint] || 0;
};

PlayerSchema.methods.getHeroClassDescription = function () {

    if (!this.class) {
        return 'All heroes are destined for greatness, your journey begins now. When you reach level 10 you can choose your path and select a heroclass.';
    }

    if (this.class === 'Berserker') {
        return 'Berserkers have the option to rage and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure.';
    }

    if (this.class === 'Wizard') {
        return `Wizards have the option to focus and add large bonuses to their magic, but their focus can sometimes go astray...
    Use the focus command when attacking in an adventure.`;
    }

    if (this.class === 'Ranger') {
        return `Rangers can gain a special pet, which can find items and give reward bonuses.
    Use the pet command to see pet options.`;
    }

    if (this.class === 'Tinkerer') {
        return `Tinkerers can forge two different items into a device bound to their very soul.
    Use the forge command.`;
    }

    if (this.class === 'Cleric') {
        return `Clerics can bless the entire group when praying.
    Use the bless command when fighting in an adventure.`;
    }
};

PlayerSchema.methods.getHeroClassThumbnail = function () {

    if (!this.class) {
        return 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/618476d18c95662c3352f18b5c3b5118/CLASSRogue.JPG';
    }

    if (this.class === 'Berserker') {
        return 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/5cc20b78734ffe0d264885ada90cd961/CLASSBarbarian.JPG';
    }

    if (this.class === 'Wizard') {
        return `https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/34b30b92157ecc2bf75af2bcf708ba5a/CLASSWizard.JPG`;
    }

    if (this.class === 'Ranger') {
        return `https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/2f0bc2ec03ff460ee815abe46b725347/CLASSRanger.JPG`;
    }

    if (this.class === 'Tinkerer') {
        return `https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/b633bd0239f0ee1ef5f47272c7814c01/CLASSNecromancer.JPG`;
    }

    if (this.class === 'Cleric') {
        return `https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/56783c25637a39cb722076bec44bb29e/CLASSCleric.JPG`;
    }
}
    

PlayerSchema.methods.getRebirths = function () {
    return this.get('rebirths') || 0;
};

PlayerSchema.methods.getMaxLevel = function () {
    return this.get('maxLevel') || 1;
};

PlayerSchema.methods.getIdFromName = function (id: string) {
    const newId = id.replace(/[!@<>]/g, '');
    return newId;
};

PlayerSchema.methods.hasBeenBanned = function () {
    return this.isBanned;
};

PlayerSchema.methods.setRebirths = function (rebirths: number) {
    this.rebirths = rebirths;

    return this.save();
};

PlayerSchema.methods.setExperience = async function (experience: number) {
    this.experience = experience;

    await this.handleLevelUp();

    return this.save();
};

PlayerSchema.methods.giveExperience = async function (experience: number) {
    if (typeof experience === 'string') {
        experience = parseInt(experience);
    }

    this.experience += experience;

    await this.handleLevelUp();

    return this.save();
};

PlayerSchema.methods.setLevel = function (level: number) {
    this.level = level;

    return this.save();
};

PlayerSchema.methods.addCurrency = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    this.currency = Math.ceil(this.currency + amount);

    return this.save();
};

PlayerSchema.methods.removeCurrency = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    this.currency -= Math.ceil(amount);

    return this.save();
};

PlayerSchema.methods.makeAdmin = function () {
    this.isAdmin = true;

    return this.save();
};

PlayerSchema.methods.ban = function () {
    this.isBanned = true;

    return this.save();
};

PlayerSchema.methods.unban = function () {
    this.isBanned = false;

    return this.save();
};

PlayerSchema.methods.attackEnemy = function (enemy: IEnemy, action: String, area: IArea) {
    let roll = Math.floor(Math.random() * 50);

    const goldLoss = Math.round(enemy.baseHp * enemy.goldMultiplier * area.goldMultiplier * 0.3);

    if (roll === 0) {
        roll = 1;
    }

    if (action === 'attack') {
        const attSkillPoints = this.get(`skillpoints.attack`);

        const damage = ((this.getStat('attack') + roll + attSkillPoints) + this.rebirths);
        const baseDamage = (this.getStat('attack') + attSkillPoints);

        return <PlayerAttack>{
            player: this,
            roll: roll,
            baseDamage: baseDamage,
            critDamage: 10,
            totalDamage: damage,
            goldLoss,
        };
    }
    if (action === 'spell') {
        const intSkillPoints = this.get(`skillpoints.intelligence`);

        const damage = ((this.getStat('intelligence') + roll + intSkillPoints) + this.rebirths);
        const baseDamage = (this.getStat('intelligence') + intSkillPoints);

        return <PlayerAttack>{
            player: this.toObject(),
            roll: roll,
            baseDamage: baseDamage,
            critDamage: 10,
            totalDamage: damage,
            goldLoss,
        };
    }
}

PlayerSchema.methods.gainXpAfterKillingEnemy = async function (enemy: IEnemy, area: IArea, rewardresult: RewardResult) {
    const xpGained = rewardresult.totalXp;

    await this.giveExperience(xpGained);

    return xpGained;
};

PlayerSchema.methods.gainGoldAfterKillingEnemy = async function (enemy: IEnemy, area: IArea, rewardresult: RewardResult) {
    const goldGained = rewardresult.totalGold;

    await this.addCurrency(goldGained);

    return goldGained;
}

PlayerSchema.methods.loseGoldAfterLosingToEnemy = async function (enemy: IEnemy, area: IArea) {
    const goldLost = enemy.baseHp * enemy.goldMultiplier * area.goldMultiplier * 0.3;

    await this.removeCurrency(goldLost);

    return goldLost;
}

PlayerSchema.methods.getExperienceNeededForLevel = function (level: number) {
    return Math.ceil(Math.pow(level, 3.5));
}

PlayerSchema.methods.getLevelForCurrentExperience = function (enemy: IEnemy, area: IArea) {
    // https://stackoverflow.com/a/9309300/405529
    return Math.ceil(Math.pow(this.experience, 1 / 3.5));
}

PlayerSchema.methods.handleLevelUp = async function () {
    const levelForCurrentExperience = this.getLevelForCurrentExperience();
    let newLevel = levelForCurrentExperience;
 
    if (levelForCurrentExperience > this.maxLevel) {
        this.experience = this.getExperienceNeededForLevel(this.maxLevel);

        newLevel = this.maxLevel;
    }

    this.level = newLevel;

//    const save = this.save();

    return newLevel;
};

PlayerSchema.methods.handleSkillpointRewards = async function (startLevel: number, endLevel: number, player: IPlayer) {
    
    let allPassedLevels = [];
    let sumEven = 0;
    let levelUp = false;

    for (let i = startLevel + 1; i <= endLevel; i++) {
    allPassedLevels.push(i);
    }

    if(allPassedLevels.length > 0){
    for (let i = 0; i <= allPassedLevels.length; i++) {
        if (allPassedLevels[i] % 2 === 0) {
          sumEven++;
        }
    }
}
const currentPoints = this.get(`skillpoints.unspent`);
const newPoints = this.set(`skillpoints.unspent`, (sumEven + Number(currentPoints)));

    if(startLevel < endLevel)
    {
        levelUp = true;
    }
    else{
        levelUp = false;
    }
const save = this.save();

    console.log(allPassedLevels);
    return <EarnedSkillpoints>{
        player: this,
        level: endLevel,
        totalSkillpoints: sumEven,
        levelUp: levelUp,
        }
};


PlayerSchema.methods.rebirth = async function () {
    if (this.level < this.maxLevel) {
        throw new Error('Cannot rebirth');
    }

    const options: Array<String> = ['attack', 'charisma', 'intelligence','unspent'];
    

    for (let i = 0; i <= options.length; i++) {
        const currentPointsInSkill = this.get(`skillpoints.${options[i]}`);
        const newPointsInSkill = this.set(`skillpoints.${options[i]}`, 0 );
    }

    this.experience = 1;
    this.level = 1;

    this.rebirths += 1
    this.maxLevel += 10;

    return this.save();
};

PlayerSchema.methods.makeItem = async function (type: string, amount: number)
{
    const item: IItem = new Item;

    let realAmount = amount;
    let realType = type;
    let enough = false;

    const amountBeforeLoot = Number(this.get(`loot.${realType}`));
    const amountAfterLoot = (amountBeforeLoot - realAmount);

    let allItemsGenerated = [];

    if(realAmount <= amountBeforeLoot){
    enough = true;    
    const thisItem = await item.makeItem(realType, realAmount);
    allItemsGenerated = thisItem;    

    const setAmountAfterLoot = await this.set(`loot.${realType}`, amountAfterLoot);

    for (let i = 0; i <= thisItem.length; i++) {
        if(thisItem[i] != null)
        {
        this.backpack.push(thisItem[i]);
        }
      }

    }
    
    if(realAmount > amountBeforeLoot)
    {
        enough = false;
    }

    const save = this.save();

    return <ItemGenerationResult>{
        items: allItemsGenerated,
        enough,
    };

}


PlayerSchema.methods.postBattleRewards = function (player: IPlayer, enemy: IEnemy, area: IArea) {

    const goldRoll = Math.floor(Math.random() * 50);
    const xpRoll = Math.floor(Math.random() * 50);
    let bonusGoldPercentage = 0;
    let bonusXpPercentage = 0;
    const baseGold = Math.round((enemy.baseHp * 10)) * enemy.goldMultiplier * area.goldMultiplier;
    const baseXp =  Math.round(enemy.baseHp * enemy.xpMultiplier * area.xpMultiplier);

    if (goldRoll >= 20){
        bonusGoldPercentage = 1.2;
    }

    else if (goldRoll >= 10){
        bonusGoldPercentage = 1.15;
    }

    else {
        bonusGoldPercentage = 1;
    }

    if (xpRoll >= 20){
        bonusXpPercentage = 1.2;
    }

    else if (xpRoll >= 10){
        bonusXpPercentage = 1.15;
    }

    else {
        bonusXpPercentage = 1;
    }

    const totalGold = Math.round(baseGold * bonusGoldPercentage);
    const totalXp = Math.round(baseXp * bonusXpPercentage);


    return <RewardResult>{
        player: player,
        xpRoll: xpRoll,
        goldRoll: goldRoll,
        xpBonusPercentage: bonusXpPercentage,
        goldBonusPercentage: bonusGoldPercentage,
        baseGold: baseGold,
        baseXp: baseXp,
        totalGold: totalGold,
        totalXp: totalXp,
    };
};

PlayerSchema.methods.useSkillpoints = async function (desiredSkill: string, amount?: number) {
    
    let realAmount = 0;
    let skill = desiredSkill.toLowerCase();
    let worked = false;

    const options: Array<String> = ['attack', 'charisma', 'intelligence', 'att', 'cha', 'int'];

    if (!options.includes(skill)) {
        worked = false;
        return;
    }

    if(skill == 'att'){
        skill = 'attack';
    }
    if(skill == 'cha'){
        skill = 'charisma';
    }
    if(skill == 'int'){
        skill = 'intelligence';
    }

    if(!amount){
        realAmount = 1;
    }
    if(amount){
        realAmount = amount;
    }

    
    const currentPoints = this.get(`skillpoints.unspent`);

    if(currentPoints >= realAmount){
        const currentPointsInSkill = this.get(`skillpoints.${skill}`);
        const newPointsInSkill = this.set(`skillpoints.${skill}`, (Number(currentPointsInSkill) + Number(realAmount)));
        const removeUnspent = this.set(`skillpoints.unspent`, (Number(currentPoints) - Number(realAmount)));
        worked = true;

    }
    else{
        worked = false;
    }
    const finalPointsInSkill = await this.get(`skillpoints.${skill}`);
    const save = await this.save();

    return <SkillpointResults>{
        player: this,
        finalPoints: finalPointsInSkill,
        skill,
        worked,
    }
};

PlayerSchema.methods.clearBag = async function () {

    this.backpack = [];

    return this.save();
};

PlayerSchema.methods.postBattleLootRewards = function (player: IPlayer, area: IArea)
{
    const normalRoll = Math.random();
    const rareRoll = Math.random();
    const epicRoll = Math.random();
    const legendaryRoll = Math.random();
    const ascendedRoll = Math.random();
    const setRoll = Math.random();

    const normalDropRate = area.normalChestDropRate;
    const rareDropRate = area.rareChestDropRate;
    const epicDropRate = area.epicChestDropRate;
    const legendaryDropRate = area.legendaryChestDropRate;
    const ascendedDropRate = area.ascendedChestDropRate;
    const setDropRate = area.setChestDropRate;

    let totalNormalChests = 0;
    let totalRareChests = 0;
    let totalEpicChests = 0;
    let totalLegendaryChests = 0;
    let totalAscendedChests = 0;
    let totalSetChests = 0;

    if(normalRoll < normalDropRate)
    {
        if(normalRoll < (normalDropRate / 2)){
            totalNormalChests = 2;
        }
        totalNormalChests = 1;
    }

    if(rareRoll < rareDropRate)
    {
        if(rareRoll < (rareDropRate / 2)){
            totalRareChests = 2;
        }
        totalRareChests = 1;
    }

    if(epicRoll < epicDropRate)
    {
        if(normalRoll < (normalDropRate / 2)){
            totalEpicChests = 2;
        }
        totalEpicChests = 1;
    }

    if(legendaryRoll < legendaryDropRate)
    {
        if(legendaryRoll < (legendaryDropRate / 2)){
            totalLegendaryChests = 2;
        }
        totalLegendaryChests = 1;
    }

    if(ascendedRoll < ascendedDropRate)
    {
        if(ascendedRoll < (ascendedDropRate / 2)){
            totalAscendedChests = 2;
        }
        totalAscendedChests = 1;
    }

    if(setRoll < setDropRate)
    {
        if(setRoll < (setDropRate / 2)){
            totalSetChests = 2;
        }
        totalSetChests = 1;
    }

    const total = totalNormalChests + totalRareChests + totalEpicChests + totalLegendaryChests + totalAscendedChests + totalSetChests;

    const loot: LootReward = {
        player: player,
        normal: totalNormalChests,
        rare: totalRareChests,
        epic: totalEpicChests,
        legendary: totalLegendaryChests,
        ascended: totalAscendedChests,
        set: totalSetChests,
        total,
    }

    const give = this.giveChest(loot);
    return give;
}

PlayerSchema.methods.giveChest = async function (loot: LootReward) {


    const currentNormalChests = this.get(`loot.normal`);
    const newNormalChests = await this.set(`loot.normal`, currentNormalChests + loot.normal);

    const currentRareChests = this.get(`loot.rare`);
    const newRareChests = await this.set(`loot.rare`, currentRareChests + loot.rare);

    const currentEpicChests = this.get(`loot.epic`);
    const newEpicChests = await this.set(`loot.epic`, currentEpicChests + loot.epic);

    const currentLegendaryChests = this.get(`loot.legendary`);
    const newLegendaryChests = await this.set(`loot.legendary`, currentLegendaryChests + loot.legendary);

    const currentAscendedChests = this.get(`loot.ascended`);
    const newAscendedChests = await this.set(`loot.ascended`, currentAscendedChests + loot.ascended);

    const currentSetChests = this.get(`loot.sets`);
    const newSetChests = await this.set(`loot.sets`, currentSetChests + loot.set);


    return loot;
};

PlayerSchema.methods.returnLoot = async function (player: IPlayer) {

    const totalNormalChests = player.get(`loot.normal`);
    const totalRareChests = player.get(`loot.rare`);
    const totalEpicChests = player.get(`loot.epic`);
    const totalLegendaryChests = player.get(`loot.legendary`);
    const totalAscendedChests = player.get(`loot.ascended`);
    const totalSetChests = player.get(`loot.sets`);
    const totalChests = totalNormalChests + totalRareChests + totalEpicChests + totalLegendaryChests + totalAscendedChests + totalSetChests;

    const loot: LootReward = {
        player: player,
        normal: totalNormalChests,
        rare: totalRareChests,
        epic: totalEpicChests,
        legendary: totalLegendaryChests,
        ascended: totalAscendedChests,
        set: totalSetChests,
        total: totalChests,
    }


    return loot;
};

PlayerSchema.methods.returnBackpack = async function () {

    //let allItems: Array<IItem> = [];
    //let currentBackpack = this.get('backpack');

    const sorted: Array<IItem> = await this.sortBackpack();

    //for (let i = 0; i <= sorted.length; i++) {
    //    allItems.push(sorted[i])
    //}
    //console.log(sorted);
    return sorted;
};

PlayerSchema.methods.sortBackpack = async function () {

    const currentBackpack: Array<IItem> = this.get('backpack');

    const sorted = await _.sortBy(currentBackpack,[{slot: 'charm'},{slot: 'ring'},{slot: 'two handed'},{slot: 'right'},{slot: 'left'},{slot: 'boots'},{slot: 'legs'},{slot: 'belt'},{slot: 'gloves'},{slot: 'chest'},{slot: 'neck'},{slot: 'head'},{rarity: 'normal'},{rarity: 'rare'},{rarity: 'epic'},{rarity: 'legendary'},{rarity: 'ascended'},{rarity: 'set'}]);
    return sorted;
}

PlayerSchema.methods.equip = async function (name: string, player: IPlayer) {

    const itemName = name;
    const check = await this.checkPlayerHaveItem(itemName);

    const currentBackpack: Array<IItem> = this.get('backpack');

    let selectedItem;
    let worked = false;

    let noItem;

    if(check)
    {
        noItem = false;

        for (let i = 0; i < currentBackpack.length; i++) {
            if(currentBackpack[i].name.includes(name))
            {
                selectedItem = currentBackpack[i];
            }

            
        }

        if(!selectedItem){
            return;
        }

        let slot = 'helmet';
        for (let i = 0; i < 15; i++) {
            if(selectedItem?.slot == 'head')
            {
                slot = 'helmet';
            }
            if(selectedItem?.slot == 'neck')
            {
                slot = 'amulet';
            }
            if(selectedItem?.slot == 'chest')
            {
                slot = 'armor';
            }
            if(selectedItem?.slot == 'left' || selectedItem?.slot == 'right' || selectedItem?.slot == 'two handed')
            {
                slot = 'weapon';
            }
            if(selectedItem?.slot == 'boots')
            {
                slot = 'boots';
            }
            if(selectedItem?.slot == 'legs')
            {
                slot = 'boots';
            }
            if(selectedItem?.slot == 'charm')
            {
                slot = 'rune';
            }
            if(selectedItem?.slot == 'ring')
            {
                slot = 'ring';
            }
            if(selectedItem?.slot == 'gloves')
            {
                slot = 'gloves';
            }
        }
        
        const selectedItemSlot = slot;

        const checkSlot = await this.checkPlayerHaveAnyItemEquippedSlot(player, slot)

        console.log(checkSlot);

        if(checkSlot.hasEquipped == false)
        {
        const equipItem = await this.set(`gear.${selectedItemSlot}`, selectedItem);

        const setStats = await this.setStatsUponEquip(selectedItem);

        const removeFromBackpack = this.backpack.pull(selectedItem);

        worked = true;
        }
        if(checkSlot.hasEquipped == true)
        {
        const unequipItem = await this.unequipItemInternal(checkSlot.selectedItem, player);
        if(unequipItem){

        const equipItem = await this.set(`gear.${selectedItemSlot}`, selectedItem);

        const setStats = await this.setStatsUponEquip(selectedItem);  

        const removeFromBackpack = this.backpack.pull(selectedItem);
        
        }
        worked = true;
        }
        const save = this.save();
    }

    if(!check)
    {
        noItem = true;
    }

    
    return {worked, noItem, selectedItem};
}

PlayerSchema.methods.setStatsUponEquip = async function (selectedItem: IItem) {

    const currentBackpack: Array<IItem> = this.get('backpack');
    let worked = false;

    const currentAtt = await this.get(`stats.attack`);
    const currentCha = await this.get(`stats.charisma`);
    const currentInt = await this.get(`stats.intelligence`);
    const currentDex = await this.get(`stats.dexterity`);
    const currentLuck = await this.get(`stats.luck`);


    const equipAtt = await this.set(`stats.attack`, (selectedItem.stats.attack + currentAtt));
    const equipCha = await this.set(`stats.charisma`, (selectedItem.stats.charisma + currentCha));
    const equipInt = await this.set(`stats.intelligence`, (selectedItem.stats.intelligence + currentInt));
    const equipDex = await this.set(`stats.dexterity`, (selectedItem.stats.dexterity + currentDex));
    const equipLuck = await this.set(`stats.luck`, (selectedItem.stats.luck + currentLuck));

    return this.save();

}


PlayerSchema.methods.unequipItemExternal = async function (selectedItemName: string, player: IPlayer) {


    const externalItem = selectedItemName;

    if (!selectedItemName){
        return;
    }

    const currentlyEquippedItem = await this.checkPlayerHaveItemEquipped(selectedItemName, player);

    console.log(currentlyEquippedItem);

    if(currentlyEquippedItem == undefined)
    {
        return;
    }

    let worked = false;
    let slot = 'helmet';
 
        if(currentlyEquippedItem.slot == 'head')
        {
            slot = 'helmet';
        }
        if(currentlyEquippedItem.slot == 'neck')
        {
            slot = 'amulet';
        }
        if( currentlyEquippedItem.slot == 'chest')
        {
            slot = 'armor';
        }
        if(currentlyEquippedItem.slot == 'left' || currentlyEquippedItem.slot == 'right' || currentlyEquippedItem.slot == 'two handed')
        {
            slot = 'weapon';
        }
        if(currentlyEquippedItem.slot == 'boots')
        {
            slot = 'boots';
        }
        if(currentlyEquippedItem.slot == 'legs')
        {
            slot = 'boots';
        }
        if(currentlyEquippedItem.slot == 'charm')
        {
            slot = 'rune';
        }
        if(currentlyEquippedItem.slot == 'ring')
        {
            slot = 'ring';
        }
        if(currentlyEquippedItem.slot == 'gloves')
        {
            slot = 'gloves';
        }
    


    const gear: IItem = player.get(`gear.${slot}`);

    const currentAtt = await this.get(`stats.attack`);
    const currentCha = await this.get(`stats.charisma`);
    const currentInt = await this.get(`stats.intelligence`);
    const currentDex = await this.get(`stats.dexterity`);
    const currentLuck = await this.get(`stats.luck`);

    const equipAtt = await this.set(`stats.attack`, (currentAtt - currentlyEquippedItem.stats.attack));
    const equipCha = await this.set(`stats.charisma`, (currentCha - currentlyEquippedItem.stats.charisma));
    const equipInt = await this.set(`stats.intelligence`, (currentInt - currentlyEquippedItem.stats.intelligence));
    const equipDex = await this.set(`stats.dexterity`, (currentDex - currentlyEquippedItem.stats.dexterity));
    const equipLuck = await this.set(`stats.luck`, (currentLuck - currentlyEquippedItem.stats.luck));


    const putBackInBackpack = this.backpack.push(currentlyEquippedItem);
    let pullEquippedItem = await player.set(`gear.${slot}`, []);


    const save = this.save();

    const currentBackpack2: Array<IItem> = this.get('backpack');

    for (let i = 0; i < currentBackpack2.length; i++) {
        if(currentBackpack2[i].name == (currentlyEquippedItem.name))
        {
            worked = true;
        }
    }
    return {worked, currentlyEquippedItem};
}

PlayerSchema.methods.unequipItemInternal = async function (currentlyEquippedItem: IItem, player: IPlayer) {

let worked = false;

    let slot = 'helmet';
 
        if(currentlyEquippedItem.slot == 'head')
        {
            slot = 'helmet';
        }
        if(currentlyEquippedItem.slot == 'neck')
        {
            slot = 'amulet';
        }
        if( currentlyEquippedItem.slot == 'chest')
        {
            slot = 'armor';
        }
        if(currentlyEquippedItem.slot == 'left' || currentlyEquippedItem.slot == 'right' || currentlyEquippedItem.slot == 'two handed')
        {
            slot = 'weapon';
        }
        if(currentlyEquippedItem.slot == 'boots')
        {
            slot = 'boots';
        }
        if(currentlyEquippedItem.slot == 'legs')
        {
            slot = 'boots';
        }
        if(currentlyEquippedItem.slot == 'charm')
        {
            slot = 'rune';
        }
        if(currentlyEquippedItem.slot == 'ring')
        {
            slot = 'ring';
        }
        if(currentlyEquippedItem.slot == 'gloves')
        {
            slot = 'gloves';
        }
        

    const currentAtt = await this.get(`stats.attack`);
    const currentCha = await this.get(`stats.charisma`);
    const currentInt = await this.get(`stats.intelligence`);
    const currentDex = await this.get(`stats.dexterity`);
    const currentLuck = await this.get(`stats.luck`);

    const equipAtt = await this.set(`stats.attack`, (currentAtt - currentlyEquippedItem.stats.attack));
    const equipCha = await this.set(`stats.charisma`, (currentCha - currentlyEquippedItem.stats.charisma));
    const equipInt = await this.set(`stats.intelligence`, (currentInt - currentlyEquippedItem.stats.intelligence));
    const equipDex = await this.set(`stats.dexterity`, (currentDex - currentlyEquippedItem.stats.dexterity));
    const equipLuck = await this.set(`stats.luck`, (currentLuck - currentlyEquippedItem.stats.luck));


    let pullEquippedItem = await player.set(`gear.${slot}`, []);
    //this.gear.slot.pull(currentlyEquippedItem);

    const putBackInBackpack = this.backpack.push(currentlyEquippedItem);

   // const save = this.save();

    const currentBackpack2: Array<IItem> = this.get('backpack');

    for (let i = 0; i < currentBackpack2.length; i++) {
        if(currentBackpack2[i].name == (currentlyEquippedItem.name))
        {
            worked = true;
        }
    }
    return worked;
}

PlayerSchema.methods.checkPlayerHaveItem = async function (name: string) {

    let has = false;

    const currentBackpack: Array<IItem> = this.get('backpack');
    
        for (let i = 0; i < currentBackpack.length; i++) {
            if(currentBackpack[i].name.includes(name))
            {
                has = true;
            }
        }
    
    return has;
}

PlayerSchema.methods.checkPlayerHaveItemEquipped = async function (name: string, player: IPlayer) {

    let hasEquipped = false;
    let selectedItem;


    let playerHelmet = await player.get('gear.helmet');
    if (playerHelmet[0] != undefined && playerHelmet[0].name.includes(name))
    {
        selectedItem = playerHelmet[0];
        hasEquipped = true;
    }

    let playerGloves = await player.get('gear.gloves');
    if (playerGloves[0] != undefined && playerGloves[0].name.includes(name))
    {
        selectedItem = playerGloves[0];
        hasEquipped = true;
    }

    let playerArmor = await player.get('gear.armor');
    if (playerArmor[0] != undefined && playerArmor[0].name.includes(name))
    {
        selectedItem = playerArmor[0];
        hasEquipped = true;
    }

    let playerWeapon = await player.get('gear.weapon');
    if (playerWeapon[0] != undefined && playerWeapon[0].name.includes(name))
    {
        selectedItem = playerWeapon[0];
        hasEquipped = true;
        }

    let playerShield = await player.get('gear.shield');
    if (playerShield[0] != undefined && playerShield[0].name.includes(name))
    {
        selectedItem = playerShield[0];
        hasEquipped = true;
    }

    let playerBoots = await player.get('gear.boots');
    if (playerBoots[0] != undefined && playerBoots[0].name.includes(name))
    {
        selectedItem = playerBoots[0];
        hasEquipped = true;
    }

    let playerAmulet = await player.get('gear.amulet');
    if (playerAmulet[0] != undefined && playerAmulet[0].name.includes(name))
    {
        selectedItem = playerAmulet[0];
        hasEquipped = true;
    }

    let playerRing = await player.get('gear.ring');
    if (playerRing[0] != undefined && playerRing[0].name.includes(name))
    {
        selectedItem = playerRing[0];
        hasEquipped = true;
    }

    let playerRune = await player.get('gear.rune');
    if (playerRune[0] != undefined && playerRune[0].name.includes(name))
    {
        selectedItem = playerRune[0];
        hasEquipped = true;
    }

    return selectedItem;
}

PlayerSchema.methods.checkPlayerHaveAnyItemEquippedSlot = async function (player: IPlayer, slot: string) {

    let hasEquipped = false;
    let selectedItem;


    let playerSlot = await player.get(`gear.${slot}`);
    if (playerSlot[0] != undefined)
    {
        selectedItem = playerSlot[0];
        hasEquipped = true;
    }

    return {selectedItem, hasEquipped};
}






const Player = model<IPlayer>('Player', PlayerSchema);

export { Player, PlayerSchema, IPlayer, RewardResult, EarnedSkillpoints, SkillpointResults, LootReward, ItemGenerationResult };
