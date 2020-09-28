import { MessageEmbed, EmbedFieldData } from "discord.js";
import { makeClassNotSelectedMessage } from "../messages/class-not-selected";
import { makeClassSelectedMessage } from "../messages/class-selected";
import { makeInvalidHeroclassMessage } from "../messages/invalid-heroclass";
import { makeStartMessage } from "../messages/start-message";
import { makeStatsMessage } from "../messages/stats";
import { Player, IPlayer } from '../models/Player';
import BaseCommands from "./base-commands";

class GenericCommands extends BaseCommands {
    // stats([first, last]: [string?, string?]) {
    // Example parameters
    // }

    async start() {
        let player = await Player.findOne({ id: this.user.id }).exec();

        if (player) {
            this.message.channel.send('Looks like you have already started your adventure!');

            return;
        }

        player = new Player({
            id: this.user.id,
            guildId: this.guild.get('id'),
            username: this.user.username,
        });

        player.save();

        this.message.channel.send(makeStartMessage(player.get('username')));
    }

    async stats(other?: string) {
        const player = await Player.findOne({ id: this.message.author.id }).exec();
        let playerID = other;

        const args = playerID?.replace(/[!@<>]/g,'');

        let otherPlayer = await Player.findOne({ id: args }).exec();

        console.log(otherPlayer);

        if (!player) {
            return;
        }
        else if(other == null){
            this.message.channel.send(makeStatsMessage(player));
        }
        else if(other != null && otherPlayer){
            this.message.channel.send(makeStatsMessage(otherPlayer));
        }
        else
        return;
    }

    // Lets players select their Heroclass
    async selectHeroclass(heroclass: string) {
        let desiredClass = heroclass;

        const hero = await Player.findOne({ id: this.message.author.id }).exec();
        
        let currentLevel = await hero?.get('level');
        let heroID = await hero?.get('id');
        let desiredClassCaseFixed = await this.fixCase(desiredClass);

        // Checks if player exists in DB
        if (!hero) {
            return;
        }
        // Checks if player exists and is under level 10
        else if(hero && currentLevel < 10) {
            this.message.channel.send(makeClassNotSelectedMessage(hero.get('username')));
        }
        
        // Checks if player is atleast level 10 and input a valid class
        else if(currentLevel >= 10 && desiredClassCaseFixed ==  "Berzerker" || desiredClassCaseFixed ==  "Wizard" || desiredClassCaseFixed ==  "Ranger" || desiredClassCaseFixed ==  "Cleric"){
            const changeClass = await Player.updateOne(  { "id": heroID}, // Filter
            {$set: {"class": desiredClassCaseFixed}}, // Update
            );
            this.message.channel.send(makeClassSelectedMessage(hero.get('username'), desiredClassCaseFixed));
        }
        
        // Catches any players over level 10 that input an invalid class
        else {
            this.message.channel.send(makeInvalidHeroclassMessage(hero.get('username')));
        }

    }
    
    // Takes any string and fixes the case so that only the first letter is Uppercase for display and proper DB storage.
    private async fixCase(word: string){
        let preCase = word;
        let lowerCase = preCase.toLowerCase();
        let fixedCase = lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
      
        return fixedCase;
    }
}

export { GenericCommands };
