import { makeAdventureNotResetMessage } from "../messages/adventure-not-reset";
import { makeAdventureResetMessage } from "../messages/adventure-reset";
import { makeCooldownsResetMessage } from "../messages/cooldowns-reset";
import { makeCurrencyAddedMessage } from "../messages/currency-added";
import { makeAdminMessage } from "../messages/is-admin";
import { makeLevelChangedMessage } from "../messages/level-changed";
import { makeNotAdminMessage } from "../messages/not-admin";
import { makeRebirthsChangedMessage } from "../messages/rebirths-changed";
import { Player, IPlayer } from "../models/Player";
import BaseCommands from "./base-commands";


class AdminCommands extends BaseCommands {

    private async adminCheck() {
        // TODO check you are an admin
        const commandUser = this.message.author.id;

        let adminFindDoc = await Player.findOne({ id: commandUser }).exec();
        let adminCheckDoc = await adminFindDoc?.get('admin');
        var isAdmin = new Boolean();

        if (await adminCheckDoc === true) {
            isAdmin = true;
            return isAdmin;
        }

        else{
            isAdmin = false;
            return isAdmin;
        }
    }

    // Makes any player an administrator with -makeadmin [@username] ?[password] (Password is optional. If you are already an admin you don't need to enter it.)
    async makeAdmin(id: string, password?: string) {

        let pass = password;
        let playerID = id;

        const author = await this.message.author.username;

        const args = playerID.replace(/[!@<>]/g,'');

        if (await this.adminCheck() === true || pass === 'abc123') {

            const change = await Player.updateOne(  { "id": args}, // Filter
            {$set: {"admin": true}}, // Update
            );

            this.message.channel.send(makeAdminMessage(id));
            return;
         }
         else{
            this.message.channel.send(makeNotAdminMessage(author));
         }

    }

    // Clears any adventure currently on the board
    async clearAdventure() {
        
        const author = await this.message.author.username;

        if (await this.adminCheck() === true){

            if (this.guild.isCurrentlyAdventuring()) {
                this.guild.stopAdventure();
                this.message.channel.send(makeAdventureResetMessage());
            }
            else{
                this.message.channel.send(makeAdventureNotResetMessage());
            }
            
        }
        else{
            this.message.channel.send(makeNotAdminMessage(author));
        }

        
    }


    // Give any player currency using -addcur [amount] [@username]
    async addCurrency(amount: number, id: string) {
        
        let cur = amount;
        let playerID = id;

        const author = await this.message.author.username;
   
        const args = playerID.replace(/[!@<>]/g,'');

        let currentDoc = await Player.findOne({ id: args }).exec();
        let currentCurrency = await currentDoc?.get('currency');


            if (await this.adminCheck() === true)
            {
                const change = await Player.updateOne(  { "id": args}, // Filter
                {$set: {"currency": Number(cur) + Number(currentCurrency)}}, // Update
                );

                let newDoc = await Player.findOne({ id: args }).exec();
                let newCurrency = await newDoc?.get('currency');

                this.message.channel.send(makeCurrencyAddedMessage(id, newCurrency));
                return;
            }
            else{
                this.message.channel.send(makeNotAdminMessage(author));
                return;
            }

    }

    // Change any players Level
    async changeLevel(level: number, id: string) {
        
        let desiredLevel = level;
        let playerID = id;

        const author = await this.message.author.username;
   
        const args = playerID.replace(/[!@<>]/g,'');

        let currentDoc = await Player.findOne({ id: args }).exec();
        let currentLevel = await currentDoc?.get('level');


            if (await this.adminCheck() === true)
            {
                const change = await Player.updateOne(  { "id": args}, // Filter
                {$set: {"level": desiredLevel}}, // Update
                );

                let newDoc = await Player.findOne({ id: args }).exec();
                let newLevel = await newDoc?.get('level');

                this.message.channel.send(makeLevelChangedMessage(id, newLevel));
                return;
            }
            else{
                this.message.channel.send(makeNotAdminMessage(author));
                return;
            }

    }

    // Change any players rebirth level
    async changeRebirths(level: number, id: string) {
        
        let desiredRebirthLevel = level;
        let playerID = id;

        const author = await this.message.author.username;
   
        const args = playerID.replace(/[!@<>]/g,'');

        let currentDoc = await Player.findOne({ id: args }).exec();
        let currentLevel = await currentDoc?.get('rebirths');


            if (await this.adminCheck() === true)
            {
                const change = await Player.updateOne(  { "id": args}, // Filter
                {$set: {"rebirths": desiredRebirthLevel}}, // Update
                );

                let newDoc = await Player.findOne({ id: args }).exec();
                let newRebirthLevel = await newDoc?.get('rebirths');

                this.message.channel.send(makeRebirthsChangedMessage(id, newRebirthLevel));
                return;
            }
            else{
                this.message.channel.send(makeNotAdminMessage(author));
                return;
            }

    }

    // Reset all cooldowns (UNFINISHED)
    async resetCooldowns() {
        


        const author = await this.message.author.username;
   

            if (await this.adminCheck() === true)
            {
                const change = await Player.updateMany(  { "hasUsedAbility": true}, // Filter
                {$set: {"hasUsedAbility": false}}, // Update
                );

                this.message.channel.send(makeCooldownsResetMessage());
                return;
            }
            else{
                this.message.channel.send(makeNotAdminMessage(author));
                return;
            }

    }

}

export { AdminCommands };
