import { MessageEmbed, EmbedFieldData } from "discord.js";
import { makeStartMessage } from "../messages/start-message";
import { makeStatsMessage } from "../messages/stats";
import { Player } from '../models/Player';
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

    async stats() {
        const player = await Player.findOne({ id: this.message.author.id }).exec();

        if (!player) {
            return;
        }

        this.message.channel.send(makeStatsMessage(player));
    }
}

export { GenericCommands };
