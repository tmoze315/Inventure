import { makeAdventureInProgressMessage } from "../messages/adventure-in-progress";
import { makeClassNotSelectedMessage } from "../messages/class-not-selected";
import { makeClassSelectedMessage } from "../messages/class-selected";
import { makeErrorMessage } from "../messages/error";
import { makeInsufficientFundsClassNotSelectedMessage } from "../messages/insufficient-funds-class-not-selected";
import { makeInvalidHeroclassMessage } from "../messages/invalid-heroclass";
import { makeStandardMessage } from "../messages/standard-message";
import { makeStartMessage } from "../messages/start-message";
import { makeRebirthSuccessMessage } from "../messages/rebirth-success";
import { makeRebirthFailureMessage } from "../messages/rebirth-failure";
import { makeStatsMessage } from "../messages/stats";
import { makeBackpackMessage } from "../messages/backpack";
import { Player, IPlayer } from '../models/Player';
import BaseCommands from "./base-commands";
import { makeShowHeroclassesMessage } from "../messages/show-heroclasses";
import { makeInsufficientSkillpointsMessage } from "../messages/insufficient-skillpoints";
import { makeUsedSkillpointsMessage } from "../messages/used-skillpoints";
import { makeAvailableLootMessage } from "../messages/available-loot";
import { IItem } from "../models/Item";
import { makeChestsOpenedResultsMessage } from "../messages/chests-opened-results";
import { makeEquippedItemsMessage } from "../messages/equipped-items";
import { makeItemEquippedMessage } from "../messages/item-equipped";
import { makeItemUnequippedMessage } from "../messages/item-unequipped";

class GenericCommands extends BaseCommands {
    // stats([first, last]: [string?, string?]) {
    // Example parameters
    // }

    async start() {
        const player: IPlayer | null = await Player.findOne({ id: this.user.id }).exec();

        if (player) {
            this.message.channel.send('Looks like you have already started your adventure!');

            return;
        }

        const newPlayer = new Player({
            id: this.user.id,
            guildId: this.guild.get('id'),
            username: this.user.username,
        });

        newPlayer.save();

        this.message.channel.send(makeStartMessage(newPlayer.get('username')));
    }

    async rebirth() {
        let targetPlayerId = this.message.author.id;
        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        try {
            await player.rebirth(targetPlayerId);

            this.message.channel.send(makeRebirthSuccessMessage(player.username, player.maxLevel));
            return;
        } catch (error) {
            this.message.channel.send(makeRebirthFailureMessage(player.username, player.maxLevel));
        }
    }

    async stats(playerId?: string) {
        let targetPlayerId = this.message.author.id;

        if (playerId) {
            targetPlayerId = playerId?.replace(/[!@<>]/g, '');
        }

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        this.message.channel.send(makeStatsMessage(player));
       
    }

    async skillpoints(skill: string, amount?: number) {
        let targetPlayerId = this.message.author.id;

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        if (!skill){
            this.message.channel.send(makeErrorMessage(`You must include the desired skill using -skill [skill name]!`));
            return;
        }

        const useSkill = await player.useSkillpoints(skill, amount, player);

        if(!useSkill.worked){
        const skillpointsNotUsedMessage = makeInsufficientSkillpointsMessage(player.username);
        this.message.channel.send(skillpointsNotUsedMessage);
        }

        if(useSkill.worked){
        const skillpointsUsedMessage = makeUsedSkillpointsMessage(useSkill);
        this.message.channel.send(skillpointsUsedMessage);
        }

    }

    // Lets players select their Heroclass
    async selectHeroclass(heroclass?: string) {
        if (this.guild.isLocked) {
            this.message.channel.send(makeErrorMessage(`You cannot do that right now.`));
            return;
        }

        const player: IPlayer | null = await Player.findOne({ id: this.message.author.id }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        if (!heroclass) {
            this.message.channel.send(makeShowHeroclassesMessage(player.get('username')));
            return;
        }

        if (player.get('level') < 10 && player.get('rebirths') < 2) {
            this.message.channel.send(makeClassNotSelectedMessage(player.get('username')));
            return;
        }

        const currentCurrency = player.get('currency');
        const costToChangeHeroClass = player.get('rebirths') * 15000;

        if (currentCurrency < costToChangeHeroClass) {
            this.message.channel.send(makeInsufficientFundsClassNotSelectedMessage(player.get('username'), costToChangeHeroClass));
            return;
        }

        try {
            await player.setHeroClass(heroclass);
            await player.removeCurrency(costToChangeHeroClass);

            this.message.channel.send(makeClassSelectedMessage(player.get('username'), player.get('class')));
        } catch (exception) {
            this.message.channel.send(makeInvalidHeroclassMessage(player.get('username')));
        }
    }

    async loot(type?: string, amount?: number) {

        const player: IPlayer | null = await Player.findOne({ id: this.user.id }).exec();

        const options: Array<String> = ['normal', 'rare', 'epic', 'legendary', 'ascended', 'set'];

        let thisAmount = 0;
        let typeAcquired = false;

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        if(type === undefined){

                const availableChests = await player.returnLoot(player);
                // console.log(availableChests);
        
                const availableLootMessage = await makeAvailableLootMessage(availableChests, player);
                this.message.channel.send(availableLootMessage);
                return;  
                
        }

        if (amount === undefined){
            
        thisAmount = 1;
        }
        else
        {
        thisAmount = amount;
        }

        
        const thisType = type;
        const thisTypeCaseFixed = thisType.toLowerCase();


        


        if(!options.includes(thisTypeCaseFixed))
        {
            const improperName = makeStandardMessage('Are you sure you typed the chest type properly?\n Try again using [normal, rare, epic, legendary, ascended, set]');
            this.message.channel.send(improperName);
            return;  
        }

        const generateItems = await player.makeItem(thisTypeCaseFixed, thisAmount);
        console.log(generateItems);

        if(generateItems.enough == false){
            const notEnoughChests = await makeStandardMessage(`Sorry, it looks like you don't have enough chests to do that!`);
            this.message.channel.send(notEnoughChests);
            return;  
        }

        if(generateItems.enough == true){
            const success = await makeChestsOpenedResultsMessage(generateItems);
            this.message.channel.send(success);
            return;  
        }

        //const makeItem = await player?.makeItem();
        //console.log(makeItem);
        return;

    }

    async backpack() {
        let targetPlayerId = this.message.author.id;

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        const backpack = await player.returnBackpack();
        
        const formattedBackpack = await makeBackpackMessage(player, backpack);

        this.message.channel.send(formattedBackpack);
        return;

    }

    async equip(name: string) {
        let targetPlayerId = this.message.author.id;

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        if (!name) {
            this.message.channel.send('No item name placeholder.');
            return;
        }

        const itemName = name.charAt(0).toUpperCase() + name.slice(1).trim();

        const equipItem = await player.equip(itemName, player);

        if (equipItem.worked)
        {
            const itemEquippedMessage = await makeItemEquippedMessage(equipItem.selectedItem, player);
            this.message.channel.send(itemEquippedMessage);
        }
        if (equipItem.noItem)
        {
            this.message.channel.send('You cannot equip an item you do not own!');
            return;
        }
        if (!equipItem.worked)
        {
            this.message.channel.send('Did not work placeholder.');
        }
        
        return;

    }

    async unequip(name: string) {
        let targetPlayerId = this.message.author.id;

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        if (!name) {
            this.message.channel.send('No item name placeholder.');
            return;
        }

        const itemName = name.charAt(0).toUpperCase() + name.slice(1).trim();

        const unequipItem = await player.unequipItemExternal(itemName, player);

        if(unequipItem.worked == true)
        {
            const itemUnequippedMessage = await makeItemUnequippedMessage(unequipItem.currentlyEquippedItem, player);
            this.message.channel.send(itemUnequippedMessage);
            //this.message.channel.send('Item unequipped!');
            return;
        }

        return;

    }

    async showEquipped() {
        let targetPlayerId = this.message.author.id;

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
            return;
        }

        const showEquipped = await makeEquippedItemsMessage(player);
        this.message.channel.send(showEquipped);

        return;

    }
}

export { GenericCommands };
