import { Message as DiscordMessage } from 'discord.js';
import { IGuild } from '../../models/Guild';
import { IPlayer } from '../../models/Player';
import { IMessage } from '../message';
import { User } from '../user';

class Message implements IMessage {
    public _player: IPlayer | null = null;
    public _guild: IGuild | null = null;
    public _isFromBot: boolean = false;
    public _content: string = '';

    constructor(private discordMessage: DiscordMessage) { }

    content(): string {
        return this._content;
    }

    author(): User {
        if (this._player) {
            return new User(this._player.id, this._player.username);
        }

        return new User(1, 'testing-user');
    }

    async player(): Promise<IPlayer> {
        if (!this._player) {
            throw new Error('No player set.');
        }

        return this._player;
    }

    guildId(): string | null {
        return this._guild?.get('id') || null;
    }

    isFromBot(): boolean {
        return this._isFromBot || false;
    }

    async send(data: any): Promise<any> {
        return data;
    }
}

export { Message }
