import { makeClassNotSelectedMessage } from "../messages/class-not-selected";
import { makeClassSelectedMessage } from "../messages/class-selected";
import { makeErrorMessage } from "../messages/error";
import { makeInsufficientFundsClassNotSelectedMessage } from "../messages/insufficient-funds-class-not-selected";
import { makeInvalidHeroclassMessage } from "../messages/invalid-heroclass";
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
    async start() {
        const player: IPlayer | null = await this.message.player();

        if (player) {
            this.message.send('Looks like you have already started your adventure!');

            return;
        }

        const author = this.message.author();

        const newPlayer = new Player({
            id: author.id,
            guildId: this.guild.get('id'),
            username: author.username,
        });

        newPlayer.save();

        return this.message.send(makeStartMessage(newPlayer.get('username')));
    }

    async rebirth() {
        const player: IPlayer | null = await this.message.player();

        if (!player) {
            return this.message.send('Player not found. Please try again');
        }

        try {
            await player.rebirth();

            this.message.send(makeRebirthSuccessMessage(player.username, player.maxLevel));
            return;
        } catch (error) {
            this.message.send(makeRebirthFailureMessage(player.username, player.maxLevel));
        }
    }

    async stats(playerId?: string) {
        let targetPlayerId = this.message.author().id;

        if (playerId) {
            targetPlayerId = playerId?.replace(/[!@<>]/g, '');
        }

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            return this.message.send('Player not found. Please try again');
        }

        return this.message.send(makeStatsMessage(player));
    }

    async skillpoints(skill: string, amount?: number) {
        const player: IPlayer | null = await this.message.player();

        if (!player) {
            this.message.send('Player not found. Please try again');
            return;
        }

        if (!skill) {
            this.message.send(makeErrorMessage(`You must include the desired skill using -skill [skill name]!`));
            return;
        }

        const useSkill = await player.useSkillpoints(skill, amount, player);

        if (!useSkill.worked) {
            const skillpointsNotUsedMessage = makeInsufficientSkillpointsMessage(player.username);
            this.message.send(skillpointsNotUsedMessage);
        }

        if (useSkill.worked) {
            const skillpointsUsedMessage = makeUsedSkillpointsMessage(useSkill);
            this.message.send(skillpointsUsedMessage);
        }

    }

    // Lets players select their Heroclass
    async selectHeroclass(heroclass?: string) {
        if (this.guild.isLocked) {
            this.message.send(makeErrorMessage(`You cannot do that right now.`));
            return;
        }

        const player: IPlayer | null = await Player.findOne({ id: this.message.author().id }).exec();

        if (!player) {
            this.message.send('Player not found. Please try again');
            return;
        }

        if (!heroclass) {
            this.message.send(makeShowHeroclassesMessage(player.get('username')));
            return;
        }

        if (player.get('level') < 10 && player.get('rebirths') < 2) {
            this.message.send(makeClassNotSelectedMessage(player.get('username')));
            return;
        }

        const currentCurrency = player.get('currency');
        const costToChangeHeroClass = player.get('rebirths') * 15000;

        if (currentCurrency < costToChangeHeroClass) {
            this.message.send(makeInsufficientFundsClassNotSelectedMessage(player.get('username'), costToChangeHeroClass));
            return;
        }

        try {
            await player.setHeroClass(heroclass);
            await player.removeCurrency(costToChangeHeroClass);

            this.message.send(makeClassSelectedMessage(player.get('username'), player.get('class')));
        } catch (exception) {
            this.message.send(makeInvalidHeroclassMessage(player.get('username')));
        }
    }
}

export { GenericCommands };
