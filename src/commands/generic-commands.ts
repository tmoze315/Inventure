import { makeClassNotSelectedMessage } from "../messages/class-not-selected";
import { makeClassSelectedMessage } from "../messages/class-selected";
import { makeErrorMessage } from "../messages/error";
import { makeInsufficientFundsClassNotSelectedMessage } from "../messages/insufficient-funds-class-not-selected";
import { makeInvalidHeroclassMessage } from "../messages/invalid-heroclass";
import { makeStartMessage } from "../messages/start-message";
import { makeStatsMessage } from "../messages/stats";
import { Player, IPlayer } from '../models/Player';
import BaseCommands from "./base-commands";
import { makeShowHeroclassesMessage } from "../messages/show-heroclasses";
import { makeSuccessMessage } from "../messages/success";
import { InvalidArgument } from "../exceptions/exceptions";
import { JsxEmit } from "typescript";

class GenericCommands extends BaseCommands {
    async start() {
        const player: IPlayer | null = await Player.findOne({ id: this.message.author().id }).exec();
        const players: any = await Player.find({}).exec();

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
            targetPlayerId = playerId?.replace(/[!@<>]/g, '');
        }

        const player: IPlayer | null = await Player.findOne({ id: targetPlayerId }).exec();

        if (!player) {
            return this.message.send('Player not found. Please try again');
        }

        return this.message.send(makeStatsMessage(player));
    }

    async skillpoints(skill: string, amount: number = 1) {
        const player: IPlayer = await this.message.player();

        if (!skill) {
            return this.message.send(makeErrorMessage(`You must include the desired skill using -skill [skill name]!`));
        }

        if (amount <= 0) {
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
            return item.acceptedValues.includes(skill);
        });

        if (!availableSkill) {
            return this.message.send(makeErrorMessage(`${player.username}, that skill cannot be found.`));
        }

        try {
            await player.useSkillpoints(availableSkill.key, amount, player);

            return this.message.send(makeSuccessMessage(`${player.username}, you have increased your ${availableSkill.key} by ${amount}.`));
        } catch (error) {
            if (error instanceof InvalidArgument) {
                return this.message.send(makeErrorMessage(`${player.username}, that skill cannot be found.`));
            }

            return this.message.send(makeErrorMessage(`${player.username}, you don't have enough skillpoints.`));
        }
    }

    // Lets players select their Heroclass
    async selectHeroclass(heroclass?: string) {
        if (this.guild.isLocked) {
            this.message.send(makeErrorMessage(`You cannot do that right now.`));
            return;
        }

        const player: IPlayer | null = await Player.findOne({ id: this.message.author().id }).exec();

        if (!player) {
            this.message.send('Player not found. Please try again');
            return;
        }

        if (!heroclass) {
            this.message.send(makeShowHeroclassesMessage(player.get('username')));
            return;
        }

        if (player.get('level') < 10 && player.get('rebirths') < 2) {
            this.message.send(makeClassNotSelectedMessage(player.get('username')));
            return;
        }

        const currentCurrency = player.get('currency');
        const costToChangeHeroClass = player.get('rebirths') * 15000;

        if (currentCurrency < costToChangeHeroClass) {
            this.message.send(makeInsufficientFundsClassNotSelectedMessage(player.get('username'), costToChangeHeroClass));
            return;
        }

        try {
            await player.setHeroClass(heroclass);
            await player.removeCurrency(costToChangeHeroClass);

            this.message.send(makeClassSelectedMessage(player.get('username'), player.get('class')));
        } catch (exception) {
            this.message.send(makeInvalidHeroclassMessage(player.get('username')));
        }
    }
}

export { GenericCommands };
