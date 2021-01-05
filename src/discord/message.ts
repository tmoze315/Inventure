import { Message as DiscordMessage, User as DiscordUser } from 'discord.js';
import { IPlayer, Player } from '../models/Player';
import { User } from './user';

interface IMessage {
    content(): string;
    author(): User;
    player(): Promise<IPlayer>;
    guildId(): string | null;
    isFromBot(): boolean;
    send(data: any): Promise<any>;
}

class Message implements IMessage {
    private currentPlayer: IPlayer | null = null;

    constructor(private discordMessage: DiscordMessage) { }

    content(): string {
        return this.discordMessage.content;
    }

    author(): User {
        const user: DiscordUser = this.discordMessage.author;

        return new User(user.id, user.username);
    }

    async player(): Promise<IPlayer> {
        // Cache the current player to save DB queries
        if (this.currentPlayer) {
            return this.currentPlayer;
        }

        this.currentPlayer = await Player.findOne({ id: this.discordMessage.author.id }).exec();

        if (!this.currentPlayer) {
            throw new Error('No player found.');

        }
        return this.currentPlayer;
    }

    guildId(): string | null {
        return this.discordMessage?.guild?.id || null;
    }

    isFromBot(): boolean {
        return this.discordMessage.author.bot;
    }

    send(data: any): Promise<any> {
        return this.discordMessage.channel.send(data);
    }

    edit(data: any): Promise<any> {
        return this.discordMessage.edit(data);
    }
}

export { Message, IMessage }
