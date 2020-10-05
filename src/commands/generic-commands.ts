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
import { Player, IPlayer } from '../models/Player';
import BaseCommands from "./base-commands";
import { makeShowHeroclassesMessage } from "../messages/show-heroclasses";
import { makeInsufficientSkillpointsMessage } from "../messages/insufficient-skillpoints";
import { makeUsedSkillpointsMessage } from "../messages/used-skillpoints";

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
}

export { GenericCommands };
