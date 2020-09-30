import { makeAdventureInProgressMessage } from "../messages/adventure-in-progress";
import { makeClassNotSelectedMessage } from "../messages/class-not-selected";
import { makeClassSelectedMessage } from "../messages/class-selected";
import { makeInsufficientFundsClassNotSelectedMessage } from "../messages/insufficient-funds-class-not-selected";
import { makeInvalidHeroclassMessage } from "../messages/invalid-heroclass";
import { makeStandardMessage } from "../messages/standard-message";
import { makeStartMessage } from "../messages/start-message";
import { makeStatsMessage } from "../messages/stats";
import { Player, IPlayer } from '../models/Player';
import BaseCommands from "./base-commands";

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

    // Lets players select their Heroclass
    async selectHeroclass(heroclass: string) {
        if (this.guild.isLocked) {
            this.message.channel.send(makeStandardMessage(`You cannot do that right now.`, 'DARK_RED'));
            return;
        }

        if (this.guild.isCurrentlyAdventuring()) {
            this.message.channel.send(makeAdventureInProgressMessage());
            return;
        }

        const player: IPlayer | null = await Player.findOne({ id: this.message.author.id }).exec();

        if (!player) {
            this.message.channel.send('Player not found. Please try again');
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

            this.message.channel.send(makeClassSelectedMessage(player.get('username'), player.get('class')));
        } catch (exception) {
            this.message.channel.send(makeInvalidHeroclassMessage(player.get('username')));
        }
    }
}

export { GenericCommands };
