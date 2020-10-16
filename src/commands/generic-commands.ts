import { makeErrorMessage } from "../messages/error";
import { makeStartMessage } from "../messages/start-message";
import { makeStatsMessage } from "../messages/stats";
import { Player, IPlayer } from '../models/Player';
import BaseCommands from "./base-commands";
import { makeHeroclassHelpMessage } from "../messages/heroclass-help";
import { makeSuccessMessage } from "../messages/success";

class GenericCommands extends BaseCommands {
    async start() {
        const player: IPlayer | null = await Player.findOne({ id: this.message.author().id }).exec();

        if (player) {
            this.message.send('Looks like you have already started your adventure!');

            return;
        }

        const author = this.message.author();

        const newPlayer = new Player({
            id: author.id,
            guildId: this.guild.get('id'),
            username: author.username,
        });

        await newPlayer.save();

        return this.message.send(makeStartMessage(newPlayer.get('username')));
    }

    async rebirth() {
        if (this.guild.isLocked) {
            return this.message.send(makeErrorMessage(`You cannot rebirth right now. Your attention is needed elsewhere.`));
        }

        const player: IPlayer = await this.message.player();

        try {
            await player.rebirth();

            this.message.send(makeSuccessMessage(`Congratulations ${player.username}! You've rebirthed! Your new max level is ${player.maxLevel}`));
            return;
        } catch (error) {
            this.message.send(makeErrorMessage(`You must be level ${player.maxLevel} in order to rebirth.`));
        }
    }

    async stats(playerId?: string) {
        let targetPlayerId = this.message.author().id;

        if (playerId) {
            targetPlayerId = playerId.replace(/[!@<>]/g, '');
        }

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            return this.message.send(makeErrorMessage('Player not found. Please try again.'));
        }

        return this.message.send(makeStatsMessage(player));
    }

    async skillpoints(skill: string, amount: number = 1) {
        if (this.guild.isLocked) {
            return this.message.send(makeErrorMessage(`You cannot use your skillpoints right now. Your attention is needed elsewhere.`));
        }

        const player: IPlayer = await this.message.player();

        if (!skill) {
            return this.message.send(makeErrorMessage(`You must include the desired skill using -skill [skill name]!`));
        }

        if (amount <= 0 || isNaN(amount) || amount % 1 !== 0) {
            return this.message.send(makeErrorMessage(`${player.username}, you must provide a valid skillpoint amount.`));
        }

        const availableSkills = [
            {
                key: 'attack',
                acceptedValues: ['attack', 'att'],
            },
            {
                key: 'charisma',
                acceptedValues: ['charisma', 'cha', 'char'],
            },
            {
                key: 'intelligence',
                acceptedValues: ['intelligence', 'int', 'intel'],
            },
        ];

        const availableSkill = availableSkills.find((item) => {
            return item.acceptedValues.includes(skill.toLowerCase());
        });
        if (!availableSkill) {
            return this.message.send(makeErrorMessage(`${player.username}, that skill cannot be found.`));
        }

        try {
            await player.useSkillpoints(availableSkill.key, amount, player);

            return this.message.send(makeSuccessMessage(`${player.username}, you have increased your ${availableSkill.key} by ${amount}.`));
        } catch (error) {
            return this.message.send(makeErrorMessage(`${player.username}, you don't have enough skillpoints.`));
        }
    }

    // Lets players select their Heroclass
    async selectHeroclass(heroclass?: string) {
        if (this.guild.isLocked) {
            return this.message.send(makeErrorMessage(`You cannot select a hero class right now. Your attention is needed elsewhere.`));
        }

        const player: IPlayer = await this.message.player();

        if (!heroclass) {
            return this.message.send(makeHeroclassHelpMessage(player));
        }

        if (player.get('level') < 10 && player.get('rebirths') < 2) {
            this.message.send(makeErrorMessage(`${player.username}, you must be atleast level 10 to select a class.`));
            return;
        }

        const currentCurrency = player.get('currency');
        const cost = player.get('rebirths') * 15000;

        if (currentCurrency < cost) {
            return this.message.send(makeErrorMessage(`${player.username}, you need ${cost.toLocaleString()} gold to select a class.`));
        }

        try {
            await player.setHeroClass(heroclass);
            await player.removeCurrency(cost);

            return this.message.send(makeSuccessMessage(`Congratulations ${player.username}, you are now a ${player.class}.`));
        } catch (exception) {
            return this.message.send(makeErrorMessage(`${player.username}, that class cannot be found.`));
        }
    }
}

export { GenericCommands };
