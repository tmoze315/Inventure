import { registry } from '@alexlafroscia/service-locator';
import { Schema, model, Document } from 'mongoose';
import addSeconds from 'date-fns/addSeconds';
import isAfter from 'date-fns/isAfter';
import { IArea } from '../areas/base-area';

interface IGuild extends Document {
    id: String;
    name: String;
    xp: Number;
    currency: Number;
    allies: Number;
    enemies: Number;
    isLocked: boolean,

    lastAdventure: Date;
    lastAreaBosses: Object,
    unlockedAreas: Array<string>;

    lock: Function,
    unlock: Function,
    startAdventureCooldown: Function;
    canAdventure: Function;
    getAdventureCooldown: Function;
    changeArea: Function;
    getCurrentArea: Function;
    canTravelToArea: Function,
    getUnlockedAreas: Function,
    pay: Function,
    canAfford: Function,
    giveQuestItemForCurrentArea: Function,
    hasEnoughQuestItemsForBossInCurrentArea: Function,
    useQuestItemsForCurrentArea: Function,
    getQuestItemsForCurrentArea: Function,
    canSummonAreaBoss: Function,
    getAreaBossCooldown: Function,
    startAreaBossCooldown: Function,
    giveCurrency: Function,
    gainExperience: Function,
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
    lastAdventure: {
        required: false,
        type: Date,
    },
    lastAreaBosses: {
        required: false,
        type: Map,
        of: Object,
    },
    isLocked: {
        type: Boolean,
        default: false,
    }
});

GuildSchema.methods.lock = function () {
    this.isLocked = true;

    return this.save();
};

GuildSchema.methods.unlock = function () {
    this.isLocked = false;

    return this.save();
};

GuildSchema.methods.canAdventure = function (date: Date) {
    const cooldown = this.getAdventureCooldown();

    if (!cooldown) {
        return true;
    }

    return isAfter(date, cooldown);
};

GuildSchema.methods.getAdventureCooldown = function (): Date | null {
    if (!this.lastAdventure) {
        return null;
    }

    const AdventureConfig = registry.lookup('AdventureConfig');

    return addSeconds(this.lastAdventure, AdventureConfig.adventureCooldownInSeconds);
}

GuildSchema.methods.getAreaBossCooldown = function (): Date | null {
    const lastBattleWithAreaBoss = this.get(`lastAreaBosses.${this.currentArea}`);
    const AdventureConfig = registry.lookup('AdventureConfig');

    if (!lastBattleWithAreaBoss) {
        return null;
    }

    const timeEnded = lastBattleWithAreaBoss.timeEnded;

    if (!timeEnded) {
        return null;
    }

    return addSeconds(timeEnded, AdventureConfig.bossCooldownInSeconds);
}

GuildSchema.methods.canSummonAreaBoss = function (area: IArea, date: Date) {
    const cooldown = this.getAreaBossCooldown();

    if (!cooldown) {
        return true;
    }

    return isAfter(date, cooldown);
};

GuildSchema.methods.startAdventureCooldown = function (): Promise<any> {
    this.lastAdventure = new Date;

    return this.save();
};

GuildSchema.methods.startAreaBossCooldown = function (): Promise<any> {
    this.set(`lastAreaBosses.${this.currentArea}`, new Date);

    return this.save();
};

GuildSchema.methods.changeArea = function (area: string | IArea | null): Promise<any> {
    const AreaService = registry.lookup('AreaService');

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
    const AreaService = registry.lookup('AreaService');

    return AreaService.findArea(this.get('currentArea'));
};

GuildSchema.methods.canTravelToArea = function (area: IArea): boolean {
    return this.get('unlockedAreas').includes(area.key);
}

GuildSchema.methods.getUnlockedAreas = function (): Array<IArea> {
    const AreaService = registry.lookup('AreaService');

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

GuildSchema.methods.giveCurrency = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    this.currency += amount;

    return this.save();
}

GuildSchema.methods.gainExperience = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    this.experience += amount;

    // TODO: level up

    return this.save();
}

GuildSchema.methods.getQuestItemsForCurrentArea = function () {
    return this.get(`questItems.${this.currentArea}`) || 0;
}

GuildSchema.methods.giveQuestItemForCurrentArea = function () {
    const currentQuestItems = this.getQuestItemsForCurrentArea();

    this.set(`questItems.${this.currentArea}`, currentQuestItems + 1);

    return this.save();
}

GuildSchema.methods.hasEnoughQuestItemsForBossInCurrentArea = function (): boolean {
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
