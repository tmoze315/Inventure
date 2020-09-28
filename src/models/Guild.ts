import { Schema, model, Document, Types } from 'mongoose';
import { addSeconds, isAfter } from 'date-fns';
import AdventureConfig from '../config/adventure';

interface IGuild extends Document {
    id: String;
    name: String;
    xp: Number;
    currency: Number;
    allies: Number;
    enemies: Number;

    currentAdventure: Object;
    lastAdventure: Object;

    isCurrentlyAdventuring: Function;
    startAdventure: Function;
    stopAdventure: Function;
    canAdventure: Function;
    adventureCooldown: Function;
}

const GuildSchema = new Schema({
    id: String,
    xp: {
        type: Number,
        default: 0,
    },
    currency: {
        type: Number,
        default: 0,
    },
    allies: {
        type: Number,
        default: 0,
    },
    enemies: {
        type: Number,
        default: 1000,
    },
    currentAdventure: {
        required: false,
        exists: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: null,
            enum: [null, 'battle'],
            required: false,
        },
    },
    lastAdventure: {
        required: false,
        timeEnded: Date,
        exists: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: null,
            enum: [null, 'battle'],
            required: false,
        },
    },
});

GuildSchema.methods.isCurrentlyAdventuring = function () {
    return this.currentAdventure.exists === true;
};

GuildSchema.methods.canAdventure = function (date: Date) {
    if (!this.lastAdventure.exists) {
        return true;
    }

    const cooldown = this.adventureCooldown();

    if (!cooldown) {
        return true;
    }


    return isAfter(date, this.adventureCooldown());
};

GuildSchema.methods.adventureCooldown = function (): Date {
    const timeEnded = this.lastAdventure.timeEnded;
    return addSeconds(timeEnded, AdventureConfig.adventureCooldownInSeconds);
};

GuildSchema.methods.startAdventure = function (type: String): Promise<any> {
    this.currentAdventure = {
        exists: true,
        type,
    };

    return this.save();
};

GuildSchema.methods.stopAdventure = function (): Promise<any> {

    this.lastAdventure = {
        exists: true,
        type: this.currentAdventure.type,
        timeEnded: new Date,
    };

    this.currentAdventure = {
        exists: false,
    };


    // this.markModified('timeEnded');

    return this.save();
};

const Guild = model<IGuild>('Guild', GuildSchema);

export { Guild, GuildSchema, IGuild };
