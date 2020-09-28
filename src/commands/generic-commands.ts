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
        const player = await Player.findOne({ id: this.user.id }).exec();

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
        let player;

        if (playerId) {
            const targetPlayerId = playerId?.replace(/[!@<>]/g, '');
            player = await Player.findOne({ id: targetPlayerId }).exec();
        } else {
            player = await Player.findOne({ id: this.message.author.id }).exec();
        }

        if (!player) {
            return;
        }

        this.message.channel.send(makeStatsMessage(player));
    }

    // Lets players select their Heroclass
    async selectHeroclass(heroclass: string) {
        const player = await Player.findOne({ id: this.message.author.id }).exec();

        if (!player) {
            return;
        }

        if (player.get('level') < 10 && player.get('rebirths') < 2) {
            this.message.channel.send(makeClassNotSelectedMessage(player.get('username')));

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
