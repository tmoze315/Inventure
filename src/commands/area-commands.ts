import { Message, CollectorFilter, MessageReaction, User } from "discord.js";
import BaseCommands from "./base-commands";
import { IArea } from "../areas/base-area";
import { makeAreaChangedMessage } from "../messages/area-changed";
import { makeChangeAreaConfirmationMessage } from "../messages/change-area-confirmation";
import AreaService from "../services/AreaService";
import { makeAreaHelpMessage } from "../messages/area-help";
import { makeCurrentAreaMessage } from "../messages/current-area";
import { makeErrorMessage } from "../messages/error";
import { makeSuccessMessage } from "../messages/success";
import { makeLockedMessage } from "../messages/locked";

class AreaCommands extends BaseCommands {
    async area() {
        const area: IArea | null = this.guild.getCurrentArea();

        if (!area) {
            this.message.channel.send(makeErrorMessage('Sorry, you are not currently in any area'));
            return;
        }

        this.message.channel.send(makeCurrentAreaMessage(area, this.guild));
    }

    async travel(areaName?: string) {
        if (!areaName) {
            this.message.channel.send(makeAreaHelpMessage(this.guild));
            return;
        }

        if (this.guild.isLocked) {
            this.message.channel.send(makeLockedMessage());
            return;
        }

        const area: IArea | null = AreaService.findArea(areaName);

        if (!area || !this.guild.canTravelToArea(area)) {
            this.message.channel.send(makeErrorMessage('Sorry, that area either does not exist or you have not unlocked it yet'));
            return;
        }

        if (area.key === this.guild.get('currentArea')) {
            this.message.channel.send(makeErrorMessage(`You are already in ${area.name}.`));
            return;
        }

        if (!this.guild.canAfford(area.travelCost)) {
            this.message.channel.send(makeErrorMessage(`Your guild cannot afford to travel to this location.`));
            return;
        }

        await this.guild.lock();

        const secondsToWait = 45;
        const message: Message = await this.message.channel.send(makeChangeAreaConfirmationMessage(this.message.author.username, area, this.guild, `${secondsToWait}s`));

        await this.countdownSeconds(secondsToWait,
            (timeRemaining: string, color: string) => {
                message.edit(makeChangeAreaConfirmationMessage(this.message.author.username, area, this.guild, timeRemaining));
            },
            () => {
                message.delete();
            }
        );

        message.react('✅');
        message.react('❌');

        const userReactions: Array<any> = [];

        const emojiFilter: CollectorFilter = async (reaction, user) => {
            if (user.bot) {
                return true;
            }

            const usersLastReaction = userReactions[user.id];

            if (usersLastReaction) {
                await usersLastReaction.users.remove(user.id);
            }

            userReactions[user.id] = reaction;

            // TODO: Check player has "started". If they haven't remove their reaction and DM them
            // TODO: Handle the case where a player removes their own emoji

            return true;
        };

        const reactions = await message.awaitReactions(emojiFilter, { time: secondsToWait * 1000 });

        const approveList: Array<User> = [];
        const denyList: Array<User> = [];

        reactions.forEach((reaction: MessageReaction, emoji: String) => {
            const totalReactions = reaction?.count || 0;

            // Ignore the bot's reaction
            if (totalReactions <= 1) {
                return;
            }

            const users = reaction.users.cache.filter((user: any): boolean => {
                return !user.bot;
            }).array();

            if ('✅' === emoji) {
                approveList.push(...users);
            } else if ('❌' === emoji) {
                denyList.push(...users);
            }
        });

        if (denyList.length > 0 || approveList.length === 0) {
            this.guild.unlock();
            this.message.channel.send(makeErrorMessage(`You decided not to travel to ${area.name}.`));

            return;
        }

        try {
            await this.guild.changeArea(area);
            await this.guild.pay(area.travelCost);

            const currentArea = this.guild.getCurrentArea();
            const questItems = this.guild.getQuestItemsForCurrentArea();

            this.message.channel.send(makeAreaChangedMessage(currentArea, this.guild));

            if (this.guild.hasEnoughQuestItemsForBossInCurrentArea()) {
                this.message.channel.send(makeSuccessMessage(`You have collected enough (${questItems}/${currentArea.totalQuestItemsNeeded}) ${currentArea.questItem} quest items. You may summon the area boss by using \`-boss\`.`));
            }

            await this.guild.unlock();
        } catch (error) {
            console.error(error);

            this.guild.unlock();
            this.message.channel.send(makeErrorMessage('Sorry, we were unable to travel to that location'));
        }
    }
}

export { AreaCommands };
