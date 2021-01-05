import { registry } from '@alexlafroscia/service-locator';
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
        const AdventureConfig = registry.lookup('AdventureConfig');

        if (!id || id === '') {
            return this.message.send('Oops! Looks like you forgot to include the username of the player you are promoting! Please try again with -makeadmin [@username]');
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (password && password !== AdventureConfig.adminPassword) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        if (!password && !await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        if (!targetPlayer) {
            return;
        }

        await targetPlayer.makeAdmin();

        return this.message.send(makeAdminMessage(id));
    }

    async ban(id: string) {
        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        if (!id || id === '') {
            return this.message.send('Oops! Looks like you forgot to include the username being banned! Please try again with -ban [@username]');
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return this.message.send('Player not found. Please try again');
        }

        await targetPlayer.ban();

        return this.message.send(makeBannedMessage(targetPlayer.get('username')));
    }

    async unban(id: string) {
        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        if (!id || id === '') {
            return this.message.send('Oops! Looks like you forgot to include the username being unbanned! Please try again with -unban [@username]');
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return this.message.send('Player not found. Please try again');
        }

        await targetPlayer.unban();

        return this.message.send(makeUnbannedMessage(targetPlayer.get('username')));
    }

    // Clears any adventure currently on the board
    async clearAdventure() {
        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        await this.guild.startAdventureCooldown();
        await this.guild.unlock();

        return this.message.send(makeAdventureResetMessage());
    }

    // Give any player currency using -addcur [amount] [@username]
    async addCurrency(amount: number, id: string) {
        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        if (!amount) {
            return this.message.send('Oops! Looks like you forgot to include the currency amount! Please try again with -addcur [amount] [@username]');
        }

        if (!id) {
            return this.message.send('Oops! Looks like you forgot to include the the player! Please try again with -addcur [amount] [@username]');
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return this.message.send('Player not found. Please try again');
        }

        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        await targetPlayer.addCurrency(amount);

        this.message.send(makeCurrencyAddedMessage(id, targetPlayer.get('currency')));
    }
    // Change any players Level
    async changeLevel(level: number, id: string) {
        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        if (!level) {
            return this.message.send('Oops! Looks like you forgot to include the desired level! Please try again with -changelevel [level] [@username]');
        }

        if (!id) {
            return this.message.send('Oops! Looks like you forgot to include the player! Please try again with -changelevel [level] [@username]');
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return;
        }

        const xp = targetPlayer.getExperienceNeededForLevel(level);
        await targetPlayer.setExperience(xp);

        return this.message.send(makeLevelChangedMessage(targetPlayer.get('username'), level));
    }

    // Change any players Level
    async setExperience(xp: number, id: string) {
        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));;
        }

        if (!xp) {
            return this.message.send('Oops! Looks like you forgot to include the XP amount! Please try again with -setxp [amount] [@username]');
        }

        if (!id) {
            return this.message.send('Oops! Looks like you forgot to include the player! Please try again with -setxp [amount] [@username]');
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return;
        }

        await targetPlayer.setExperience(xp);

        return this.message.send(makeXPLevelChangedMessage(targetPlayer.get('username'), xp));
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

        return this.message.send(makeXPLevelChangedMessage(targetPlayer.get('username'), targetPlayer.get('experience')));
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

        return this.message.send(makeRebirthsChangedMessage(targetPlayer.get('username'), rebirths));
    }

    // Reset all cooldowns (UNFINISHED)
    async resetCooldowns() {
        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        await Player.updateMany({ "hasUsedAbility": true },
            { $set: { "hasUsedAbility": false } },
        );

        return this.message.send(makeCooldownsResetMessage());
    }

    async clearBag(id?: string) {
        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(this.message.author().username));
        }

        if (!id || id === '') {
            return this.message.send('Oops! Looks like you forgot to include the username of the bag being cleared! Please try again with -clearbag [@username]');
        }

        const targetPlayerId = id.replace(/[!@<>]/g, '');
        const targetPlayer: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!targetPlayer) {
            return this.message.send('Player not found. Please try again');
        }

        await targetPlayer.clearBag();

        this.message.send(makeUnbannedMessage(targetPlayer.get('username')));
    }

    async generateLoot() {
        const player: IPlayer = await this.message.player();

        if (!await this.isAdmin()) {
            return this.message.send(makeNotAdminMessage(player.username));
        }

        await player.makeItem();

        return;
    }

    async sortBackpack() {
        const player: IPlayer = await this.message.player();

        const sort = await player.sortBackpack();

        return;
    }

}

export { AdminCommands };
