import { Message, CollectorFilter, Collection, MessageReaction } from "discord.js";
import BaseCommands from "./base-commands";
import { differenceInMilliseconds } from 'date-fns';
import { makeCanAdventureMessage } from "../messages/can-adventure";
import { makeCannotAdventureMessage } from "../messages/cannot-adventure";
import { makeCurrentlyAdventuringMessage } from "../messages/currently-adventuring";
import { makeAdventureBattleMessage } from "../messages/adventure-battle";
import { makeTimeRemainingMessage } from "../messages/time-remaining";
import { makeAdventureResults } from "../messages/adventure-results";

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
        this.guild.startAdventure('battle');

        // TODO: Actually pick a random monster

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

            return true;
        };

        const message: Message = await this.message.channel.send(makeAdventureBattleMessage(this.message.author.username));

        message.react('⚔️');
        message.react('✨');
        message.react('🗣');
        message.react('🙏');
        message.react('🏃‍♂️');

        // TODO: Use the time duration from the monster
        const timerMessage: Message = await this.message.channel.send(makeTimeRemainingMessage('2m 00s', 'DARK_GREEN'));
        await this.countdownMinutes(2, timerMessage);

        // 2 mins = 120000
        const reactions = await message.awaitReactions(adventureEmojisFilter, { time: 120000 });

        message.delete();

        return reactions;
    }

    handleEndOfAdventure(reactions: Collection<String, MessageReaction>) {
        console.log(reactions);

        makeAdventureResults

        // TODO: Be clever about this. There's a limit of 25 "fields". So we may want to just put this into
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
