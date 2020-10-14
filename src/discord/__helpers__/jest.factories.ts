import { MockMessage } from 'jest-discordjs-mocks';
import { Model } from 'mongoose';
import { IGuild } from '../../models/Guild';
import { IPlayer } from '../../models/Player';

const factory = (modelClass: any) => {
    const matches = modelClass.inspect().match(/\{(.*?)\}/);
    const className = matches[1].trim() || null;

    if (!className) {
        throw new Error('Unsupported class');
    }

    const factoryClass = `${className}Factory`;
    const factoryObject = eval(`new ${factoryClass}()`);

    return factoryObject.setClass(modelClass);
}

class MessageFactory {
    private player: IPlayer | null = null;
    private guild: IGuild | null = null;
    private isBot: boolean = false;

    constructor(private content: string = '') { }

    fromPlayer(player: IPlayer) {
        this.player = player;

        return this;
    }

    fromGuild(guild: IGuild) {
        this.guild = guild;

        return this;
    }

    isFromBot(isBot: boolean = true) {
        this.isBot = isBot;

        return this;
    }

    make() {
        jest.mock('../message');

        const { Message } = require('../message');
        const message = new Message(new MockMessage);

        jest.spyOn(message, 'send');

        if (this.content !== '') {
            message._content = this.content;
        }

        if (this.player !== null) {
            message._player = this.player;
        }

        if (this.guild !== null) {
            message._guild = this.guild;
        }

        message._isFromBot = this.isBot;

        return message;
    }
}

class Factory {
    private modelClass: any;

    setClass(modelClass: any) {
        this.modelClass = modelClass;

        return this;
    }

    make(data: Object = {}) {
        const item = new this.modelClass(data);

        if (!(item instanceof Model)) {
            throw new Error('Can only create models');
        }

        return item;
    }

    async create(data: Object = {}) {
        const item = this.make(data);

        await item.save();

        return item;
    }
}

/**
 * -----------------------
 * Custom Model Factories
 * -----------------------
 */
class PlayerFactory extends Factory {
    make(data: Object = {}) {
        const defaultData = {
            id: 123,
            username: 'testing-player',
        };

        const newData = { ...defaultData, ...data };


        return super.make(newData);
    }
}

class GuildFactory extends Factory {
    make(data: Object = {}) {
        const defaultData = {
            id: 222,
        };

        const newData = { ...defaultData, ...data };

        return super.make(newData);
    }
}

export { factory, MessageFactory };