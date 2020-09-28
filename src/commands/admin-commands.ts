import { makeAdventureNotResetMessage } from "../messages/adventure-not-reset";
import { makeAdventureResetMessage } from "../messages/adventure-reset";
import { makeCooldownsResetMessage } from "../messages/cooldowns-reset";
import { makeCurrencyAddedMessage } from "../messages/currency-added";
import { makeAdminMessage } from "../messages/is-admin";
import { makeLevelChangedMessage } from "../messages/level-changed";
import { makeNotAdminMessage } from "../messages/not-admin";
import { makeRebirthsChangedMessage } from "../messages/rebirths-changed";
import { Player } from "../models/Player";
import BaseCommands from "./base-commands";

class AdminCommands extends BaseCommands {
    private async isAdmin() {
        const user = await Player.findOne({ id: this.message.author.id }).exec();

        if (!user) {
            return false;
        }

        return user.get('isAdmin') === true;
    }

    // Makes any player an administrator with -makeadmin [@username] ?[password] (Password is optional. If you are already an admin you don't need to enter it.)
    async makeAdmin(id: string, password?: string) {
        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer = await Player.findOne({ id: targetPlayerId }).exec();

        if (password && password !== process.env.ADMIN_PASSWORD) {
            this.message.channel.send(makeNotAdminMessage(this.message.author.username));

            return;
        }

        if (!password && !await this.isAdmin()) {
            this.message.channel.send(makeNotAdminMessage(this.message.author.username));

            return;
        }

        if (!targetPlayer) {
            return;
        }

        await targetPlayer.makeAdmin();

        this.message.channel.send(makeAdminMessage(id));
    }

    // Clears any adventure currently on the board
    async clearAdventure() {
        if (!await this.isAdmin()) {
            this.message.channel.send(makeNotAdminMessage(this.message.author.username));
        }

        if (!this.guild.isCurrentlyAdventuring()) {
            this.message.channel.send(makeAdventureNotResetMessage());

            return;
        }

        await this.guild.stopAdventure();
        this.message.channel.send(makeAdventureResetMessage());
    }

    // Give any player currency using -addcur [amount] [@username]
    async addCurrency(amount: number, id: string) {
        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return;
        }

        if (!await this.isAdmin()) {
            this.message.channel.send(makeNotAdminMessage(this.message.author.username));
            return;
        }

        await targetPlayer.addCurrency(amount);

        this.message.channel.send(makeCurrencyAddedMessage(id, targetPlayer.get('currency')));
    }

    // Change any players Level
    async changeLevel(level: number, id: string) {
        const author = this.message.author.username;

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return;
        }

        if (!await this.isAdmin()) {
            this.message.channel.send(makeNotAdminMessage(author));
            return;
        }

        await targetPlayer.setLevel(level);

        this.message.channel.send(makeLevelChangedMessage(id, level));
    }

    // Change any players rebirth level
    async changeRebirths(rebirths: number, id: string) {
        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer = await Player.findOne({ id: targetPlayerId }).exec();

        if (!await this.isAdmin() || !targetPlayer) {
            this.message.channel.send(makeNotAdminMessage(this.message.author.username));
            return;
        }

        await targetPlayer.setRebirths(rebirths);

        this.message.channel.send(makeRebirthsChangedMessage(id, rebirths));
    }

    // Reset all cooldowns (UNFINISHED)
    async resetCooldowns() {
        if (!await this.isAdmin()) {
            this.message.channel.send(makeNotAdminMessage(this.message.author.username));
            return;
        }

        await Player.updateMany({ "hasUsedAbility": true },
            { $set: { "hasUsedAbility": false } },
        );

        this.message.channel.send(makeCooldownsResetMessage());
    }

}

export { AdminCommands };
