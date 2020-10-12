import { makeAdventureResetMessage } from "../messages/adventure-reset";
import { makeBannedMessage } from "../messages/banned";
import { makeCooldownsResetMessage } from "../messages/cooldowns-reset";
import { makeCurrencyAddedMessage } from "../messages/currency-added";
import { makeAdminMessage } from "../messages/is-admin";
import { makeLevelChangedMessage } from "../messages/level-changed";
import { makeNotAdminMessage } from "../messages/not-admin";
import { makeRebirthsChangedMessage } from "../messages/rebirths-changed";
import { makeUnbannedMessage } from "../messages/unbanned";
import { makeXPLevelChangedMessage } from "../messages/xp-level-changed";
import { IPlayer, Player } from "../models/Player";
import BaseCommands from "./base-commands";
import AdventureConfig from '../config/adventure';

class AdminCommands extends BaseCommands {
    private async isAdmin() {
        const user: IPlayer | null = await this.message.player();

        if (!user) {
            return false;
        }

        return user.get('isAdmin') === true;
    }

    // Makes any player an administrator with -makeadmin [@username] ?[password] (Password is optional. If you are already an admin you don't need to enter it.)
    async makeAdmin(id: string, password?: string) {
        if (!id || id === '') {
            this.message.send('Oops! Looks like you forgot to include the username of the player you are promoting! Please try again with -makeadmin [@username]');
            return;
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (password && password !== AdventureConfig.adminPassword) {
            this.message.send(makeNotAdminMessage(this.message.author().username));

            return;
        }

        if (!password && !await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));

            return;
        }

        if (!targetPlayer) {
            return;
        }

        await targetPlayer.makeAdmin();

        this.message.send(makeAdminMessage(id));
    }

    async ban(id: string) {
        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        if (!id || id === '') {
            this.message.send('Oops! Looks like you forgot to include the username being banned! Please try again with -ban [@username]');
            return;
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            this.message.send('Player not found. Please try again');
            return;
        }

        await targetPlayer.ban();

        this.message.send(makeBannedMessage(targetPlayer.get('username')));
    }

    async unban(id: string) {
        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        if (!id || id === '') {
            this.message.send('Oops! Looks like you forgot to include the username being unbanned! Please try again with -unban [@username]');
            return;
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            this.message.send('Player not found. Please try again');
            return;
        }

        await targetPlayer.unban();

        this.message.send(makeUnbannedMessage(targetPlayer.get('username')));
    }

    // Clears any adventure currently on the board
    async clearAdventure() {
        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        await this.guild.startAdventureCooldown();
        await this.guild.unlock();

        this.message.send(makeAdventureResetMessage());
    }

    // Give any player currency using -addcur [amount] [@username]
    async addCurrency(amount: number, id: string) {
        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        if (!amount) {
            this.message.send('Oops! Looks like you forgot to include the currency amount! Please try again with -addcur [amount] [@username]');
            return;
        }

        if (!id) {
            this.message.send('Oops! Looks like you forgot to include the the player! Please try again with -addcur [amount] [@username]');
            return;
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            this.message.send('Player not found. Please try again');
            return;
        }

        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        await targetPlayer.addCurrency(amount);

        this.message.send(makeCurrencyAddedMessage(id, targetPlayer.get('currency')));
    }

    // Change any players Level
    async changeLevel(level: number, id: string) {
        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        if (!level) {
            this.message.send('Oops! Looks like you forgot to include the desired level! Please try again with -changelevel [level] [@username]');
            return;
        }

        if (!id) {
            this.message.send('Oops! Looks like you forgot to include the player! Please try again with -changelevel [level] [@username]');
            return;
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return;
        }

        const xp = targetPlayer.getExperienceNeededForLevel(level);
        await targetPlayer.setExperience(xp);

        this.message.send(makeLevelChangedMessage(targetPlayer.get('username'), level));
    }

    // Change any players Level
    async setExperience(xp: number, id: string) {
        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        if (!xp) {
            this.message.send('Oops! Looks like you forgot to include the XP amount! Please try again with -setxp [amount] [@username]');
            return;
        }

        if (!id) {
            this.message.send('Oops! Looks like you forgot to include the player! Please try again with -setxp [amount] [@username]');
            return;
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return;
        }

        await targetPlayer.setExperience(xp);

        this.message.send(makeXPLevelChangedMessage(targetPlayer.get('username'), xp));
    }

    // Gives x amount of XP to any player using input method -givexp [amount] [@username]
    async giveExperience(xp: number, id: string) {
        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        if (!xp) {
            this.message.send('Oops! Looks like you forgot to include the XP amount! Please try again with -givexp [amount] [@username]');
            return;
        }

        if (!id) {
            this.message.send('Oops! Looks like you forgot to include the player! Please try again with -givexp [amount] [@username]');
            return;
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return;
        }

        await targetPlayer.giveExperience(xp);

        this.message.send(makeXPLevelChangedMessage(targetPlayer.get('username'), targetPlayer.get('experience')));
    }

    // Change any players rebirth level
    async changeRebirths(rebirths: number, id: string) {
        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!await this.isAdmin() || !targetPlayer) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        await targetPlayer.setRebirths(rebirths);

        this.message.send(makeRebirthsChangedMessage(targetPlayer.get('username'), rebirths));
    }

    // Reset all cooldowns (UNFINISHED)
    async resetCooldowns() {
        if (!await this.isAdmin()) {
            this.message.send(makeNotAdminMessage(this.message.author().username));
            return;
        }

        await Player.updateMany({ "hasUsedAbility": true },
            { $set: { "hasUsedAbility": false } },
        );

        this.message.send(makeCooldownsResetMessage());
    }

}

export { AdminCommands };
