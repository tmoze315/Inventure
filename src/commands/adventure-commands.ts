import { Message, CollectorFilter, Collection, MessageReaction, User } from "discord.js";
import BaseCommands from "./base-commands";
import { differenceInMilliseconds } from 'date-fns';
import { makeCanAdventureMessage } from "../messages/can-adventure";
import { makeCannotAdventureMessage } from "../messages/cannot-adventure";
import { makeCurrentlyAdventuringMessage } from "../messages/currently-adventuring";
import { makeAdventureBattleMessage } from "../messages/adventure-battle";
import { makeTimeRemainingMessage } from "../messages/time-remaining";
import { makeAdventureResults } from "../messages/adventure-results";
import { IArea } from "../areas/base-area";
import { IEnemy } from "../interfaces/enemy";
import { makeStandardMessage } from "../messages/standard-message";
import { makeAdventureInProgressMessage } from "../messages/adventure-in-progress";
import { makeSummonBossConfirmationMessage } from "../messages/summon-boss-confirmation";
import { makeSummonBossMessage } from "../messages/summon-boss";

class AdventureCommands extends BaseCommands {
    async adventure() {
        if (this.guild.isCurrentlyAdventuring()) {
            return await this.message.channel.send(makeCurrentlyAdventuringMessage());
        }

        const now = new Date;

        if (!this.guild.canAdventure(now)) {
            const cooldown = this.guild.adventureCooldown();
            const timer = differenceInMilliseconds(cooldown, now);

            const cooldownMessage = await this.message.channel.send(makeCannotAdventureMessage(cooldown, now));

            setTimeout(() => {
                cooldownMessage.edit(makeCanAdventureMessage());
            }, timer);

            return;
        }

        const reactions = await this.startAdventure();

        if (!reactions) {
            return;
        }

        await this.handleEndOfAdventure(reactions);
    }

    private async startAdventure(): Promise<Collection<String, MessageReaction> | null> {
        const area: IArea | null = this.guild.getCurrentArea();

        if (!area) {
            this.message.channel.send('Oops, it doesn\'t look like you are in an area. Travel somewhere with the `-area` command');
            return null;
        }

        const enemy: IEnemy = area.getRandomEnemy();

        this.guild.startAdventure('battle');

        const userReactions: Array<any> = [];

        const adventureEmojisFilter: CollectorFilter = async (reaction, user) => {
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


        const adventureBattleMessage = makeAdventureBattleMessage(area, enemy, this.message.author.username);
        const message: Message = await this.message.channel.send(adventureBattleMessage);

        message.react('⚔️');
        message.react('✨');
        message.react('🗣');
        message.react('🙏');
        message.react('🏃‍♂️');

        const duration = enemy.battleDurationMinutes;

        const timerMessage: Message = await this.message.channel.send(makeTimeRemainingMessage(`${duration}m 00s`, 'DARK_GREEN'));

        await this.countdownMinutes(duration,
            (timeRemaining: string, color: string) => {
                timerMessage.edit(makeTimeRemainingMessage(timeRemaining, color));
            },
            () => {
                timerMessage.delete();
            }
        );

        // const durationInMiliseconds = duration * 60000;
        const durationInMiliseconds = 0.1 * 60000;
        const reactions = await message.awaitReactions(adventureEmojisFilter, { time: durationInMiliseconds });

        message.delete();

        return reactions;
    }

    async handleEndOfAdventure(reactions: Collection<String, MessageReaction>) {
        const attackingUsers: Array<User> = [];
        const spellUsers: Array<User> = [];

        reactions.forEach((reaction: MessageReaction, emoji: String) => {
            const totalReactions = reaction?.count || 0;

            // Ignore the bot's reaction
            if (totalReactions <= 1) {
                return;
            }

            const users = reaction.users.cache.filter((user: any): boolean => {
                return !user.bot;
            }).array();

            if ('⚔️' === emoji) {
                attackingUsers.push(...users);
            } else if ('✨' === emoji) {
                spellUsers.push(...users);
            }
        });

        // TODO: Make sure we only count one reaction from each user

        // GET BASE ATTACK

        // let damage = attackingUsers.

        // const result = new AdventureResult({
        //     damage: Math.floor(Math.random() * 100),
        //     totalParticipants: attackingUsers.length + spellUsers.length,
        //     wasSuccessful: true,
        // });
        // 
        // await result.save();

        // Did we actually win?


        // TODO make this work from Enemy
        const won = Math.random() > 0.3;

        const adventureResultsMessage = makeAdventureResults(won);
        this.message.channel.send(adventureResultsMessage);

        const isMiniBoss = true;
        const isBoss = true;

        if (won && isMiniBoss) {
            await this.guild.giveQuestItemForCurrentArea();

            // TODO, pass this in
            const currentArea = this.guild.getCurrentArea();
            const questItems = this.guild.getQuestItemsForCurrentArea();

            if (this.guild.canAttackBossInCurrentArea()) {

                this.message.channel.send(makeStandardMessage(`Congratulations! You have collected enough ${currentArea.questItem} quest items (${questItems}/${currentArea.totalQuestItemsNeeded}). You may summon the area boss by using \`-boss\`.`));
            } else {
                this.message.channel.send(makeStandardMessage(`The enemy dropped one ${currentArea.questItem}. You now have (${questItems}/${currentArea.totalQuestItemsNeeded}) quest items.`));
            }
        }

        return this.guild.stopAdventure();

        // TODO: End battle (update data in Guild model)

        // TODO: Handle rewards & losses
    }

    async summonAreaBoss() {
        console.log('here');

        const area: IArea | null = this.guild.getCurrentArea();

        if (!area) {
            this.message.channel.send(makeStandardMessage('Sorry, you are not currently in any area', 'RED'));
            return;
        }

        if (this.guild.isCurrentlyAdventuring()) {
            this.message.channel.send(makeAdventureInProgressMessage());
            return;
        }

        await this.guild.startAdventure();

        const secondsToWait = 45;

        await this.message.channel.send(makeSummonBossMessage(this.message.author.username, area));

        const message: Message = await this.message.channel.send(makeSummonBossConfirmationMessage(area, `${secondsToWait}s`));

        await this.countdownSeconds(secondsToWait,
            (timeRemaining: string, color: string) => {
                message.edit(makeSummonBossConfirmationMessage(area, timeRemaining));
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
            this.message.channel.send(makeStandardMessage(`You decided not to summon the area boss this time around. Probably a wise decision.`, 'DARK_RED'));

            return;
        }

        await this.guild.useQuestItemsForCurrentArea();

        // const results = await area.summonBoss();
    }
}

export { AdventureCommands };
