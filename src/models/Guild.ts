import { Schema, model, Document } from 'mongoose';
import { addSeconds, isAfter } from 'date-fns';
import AdventureConfig from '../config/adventure';
import { IArea } from '../areas/base-area';
import AreaService from '../services/AreaService';

interface IGuild extends Document {
    id: String;
    name: String;
    xp: Number;
    currency: Number;
    allies: Number;
    enemies: Number;
    isLocked: boolean,

    currentAdventure: Object;
    lastAdventure: Object;
    unlockedAreas: Array<string>;

    isCurrentlyAdventuring: Function;
    lock: Function,
    unlock: Function,
    startAdventure: Function;
    stopAdventure: Function;
    canAdventure: Function;
    adventureCooldown: Function;
    changeArea: Function;
    getCurrentArea: Function;
    canTravelToArea: Function,
    getUnlockedAreas: Function,
    pay: Function,
    canAfford: Function,
    giveQuestItemForCurrentArea: Function,
    canAttackBossInCurrentArea: Function,
    useQuestItemsForCurrentArea: Function,
    getQuestItemsForCurrentArea: Function,
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
    currentArea: {
        type: String,
        default: 'bayhill',
        enum: ['bayhill', 'daggerford', 'dreg-marshes', 'redbay', 'the-lost-ruins', 'forest-of-angels', 'triggala-divide', 'kingdom-of-minas'],
    },
    unlockedAreas: {
        type: [String],
        default: ['bayhill'],
    },
    questItems: {
        type: Map,
        of: Number,
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
    isLocked: {
        type: Boolean,
        default: false,
    }
});

GuildSchema.methods.isCurrentlyAdventuring = function () {
    return this.currentAdventure.exists === true;
};

GuildSchema.methods.lock = function () {
    this.isLocked = true;

    return this.save();
};

GuildSchema.methods.unlock = function () {
    this.isLocked = false;

    return this.save();
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

    return this.save();
};

GuildSchema.methods.changeArea = function (area: string | IArea | null): Promise<any> {
    if (typeof area === 'string') {
        area = AreaService.findArea(area);
    }

    if (!area) {
        throw new Error(`Area ${area} not found.`);
    }

    if (!this.canTravelToArea(area)) {
        throw new Error(`Cannot travel to ${area}.`);
    }

    this.currentArea = area.key;

    return this.save();
};

GuildSchema.methods.getCurrentArea = function (): IArea | null {
    return AreaService.findArea(this.get('currentArea'));
};

GuildSchema.methods.canTravelToArea = function (area: IArea): boolean {
    return this.get('unlockedAreas').includes(area.key);
}

GuildSchema.methods.getUnlockedAreas = function (): Array<IArea> {
    return this.get('unlockedAreas').map((areaName: string): IArea | null => {
        return AreaService.findArea(areaName);
    }).filter((item: IArea | null): boolean => {
        return item !== null;
    });
}

GuildSchema.methods.pay = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    this.currency -= amount;

    return this.save();
}

GuildSchema.methods.canAfford = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    return this.currency >= amount;
}

GuildSchema.methods.getQuestItemsForCurrentArea = function () {
    return this.get(`questItems.${this.currentArea}`) || 0;
}

GuildSchema.methods.giveQuestItemForCurrentArea = function () {
    const currentQuestItems = this.getQuestItemsForCurrentArea();

    this.set(`questItems.${this.currentArea}`, currentQuestItems + 1);

    return this.save();
}

GuildSchema.methods.canAttackBossInCurrentArea = function (): boolean {
    const currentArea: IArea | null = this.getCurrentArea();

    if (!currentArea) {
        return false;
    }

    return this.getQuestItemsForCurrentArea() >= currentArea.totalQuestItemsNeeded;
}

GuildSchema.methods.useQuestItemsForCurrentArea = function () {
    const currentArea: IArea | null = this.getCurrentArea();

    if (!currentArea) {
        return false;
    }

    const currentQuestItems = this.get(`questItems.${currentArea.key}`) || 0;
    const newQuertItems = currentQuestItems - currentArea.totalQuestItemsNeeded;

    this.set(`questItems.${currentArea.key}`, newQuertItems);

    return this.save();
}

const Guild = model<IGuild>('Guild', GuildSchema);

export { Guild, GuildSchema, IGuild };
