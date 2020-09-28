import { Message, CollectorFilter, Collection, MessageReaction, User } from "discord.js";
import BaseCommands from "./base-commands";
import { differenceInMilliseconds } from 'date-fns';
import { makeCanAdventureMessage } from "../messages/can-adventure";
import { makeCannotAdventureMessage } from "../messages/cannot-adventure";
import { makeCurrentlyAdventuringMessage } from "../messages/currently-adventuring";
import { makeAdventureBattleMessage } from "../messages/adventure-battle";
import { makeTimeRemainingMessage } from "../messages/time-remaining";
import { makeAdventureResults } from "../messages/adventure-results";
import EnemyService from "../services/EnemyService";
import { IEnemy } from "../data/enemies";

class AdventureCommands extends BaseCommands {
    // stats([first, last]: [string?, string?]) {
    // Example parameters
    // }

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

        await this.handleEndOfAdventure(reactions);
    }

    private async startAdventure(): Promise<Collection<String, MessageReaction>> {
        const enemy: IEnemy = await EnemyService.getRandomEnemy();

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


        const adventureBattleMessage = makeAdventureBattleMessage(enemy, this.message.author.username);
        const message: Message = await this.message.channel.send(adventureBattleMessage);

        message.react('⚔️');
        message.react('✨');
        message.react('🗣');
        message.react('🙏');
        message.react('🏃‍♂️');

        const duration = enemy.battleDurationMinutes;

        const timerMessage: Message = await this.message.channel.send(makeTimeRemainingMessage(`${duration}m 00s`, 'DARK_GREEN'));
        await this.countdownMinutes(duration, timerMessage);

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

        const adventureResultsMessage = makeAdventureResults();
        this.message.channel.send(adventureResultsMessage);

        return this.guild.stopAdventure();

        // TODO: End battle (update data in Guild model)

        // TODO: Handle rewards & losses
    }

    // https://gist.github.com/adhithyan15/4350689
    countdownMinutes(minutes: number, message: Message) {
        let seconds: number = 60;
        let mins: number = minutes;

        const tick = () => {
            let currentMinutes = mins - 1

            seconds--;

            if (seconds % 5 === 0) {
                const remainingTime = `${currentMinutes.toString()}m ${(seconds < 10 ? 0 : '')}${seconds}s`;
                let color = 'GREEN';

                if (currentMinutes <= 0 && seconds > 30 && seconds < 60) {
                    color = 'ORANGE';
                } else if (currentMinutes <= 0 && seconds <= 30) {
                    color = 'RED';
                }

                message.edit(makeTimeRemainingMessage(remainingTime, color));
            }

            if (seconds > 0) {
                setTimeout(tick, 1000);
            } else if (minutes > 1) {
                this.countdownMinutes(mins - 1, message);
            } else if (currentMinutes <= 0 && seconds <= 0) {
                return message.delete();
            }
        }

        tick();
    }
}

export { AdventureCommands };
