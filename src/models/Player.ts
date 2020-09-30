import { Schema, model, Document } from 'mongoose';
import { ItemSchema } from './Item';

interface IPlayer extends Document {
    id: string,
    guildId: string,
    username: string,
    isAdmin: Boolean,
    class: string,
    background: string,
    experience: number,
    level: number,
    rebirths: number,
    currency: number,
    getLevel: Function,
    getHeroClass: Function,
    getHeroClassDescription: Function,
    getHeroClassThumbnail: Function,
    getRebirths: Function,
    getMaxLevel: Function,
    getStat: Function,
    getSkillpoint: Function,
    getIdFromName: Function,
    hasBeenBanned: Function,
    setExperience: Function,
    setLevel: Function,
    setRebirths: Function,
    setHeroClass: Function,
    addCurrency: Function,
    giveExperience: Function,
    makeAdmin: Function,
    ban: Function,
    unban: Function,
}

const PlayerSchema = new Schema({
    id: {
        type: String,
        index: true,
    },
    guildId: {
        type: String,
    },
    username: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    class: {
        type: String,
        default: null,
    },
    background: {
        type: String,
        default: null,
    },
    currency: {
        type: Number,
        default: 1000,
        min: 0,
    },
    experience: {
        type: Number,
        default: 0,
        min: 0,
    },
    level: {
        type: Number,
        default: 1,
        min: 0,
    },
    rebirths: {
        type: Number,
        default: 0,
        min: 0,
    },
    skillpoints: {
        unspent: {
            type: Number,
            default: 0,
            min: 0,
        },
        attack: {
            type: Number,
            default: 0,
            min: 0,
        },
        intelligence: {
            type: Number,
            default: 0,
            min: 0,
        },
        charisma: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    stats: {
        attack: {
            type: Number,
            default: 1,
            min: 0,
        },
        intelligence: {
            type: Number,
            default: 1,
            min: 0,
        },
        charisma: {
            type: Number,
            default: 1,
            min: 0,
        },
        luck: {
            type: Number,
            default: 1,
            min: 0,
        },
        dexterity: {
            type: Number,
            default: 1,
            min: 0,
        },
    },
    battle: {
        hasUsedAbility: {
            type: Boolean,
            default: false,
        },
        cooldown: Date,
    },
    loot: {
        normal: {
            type: Number,
            default: 0,
            min: 0,
        },
        rare: {
            type: Number,
            default: 0,
            min: 0,
        },
        epic: {
            type: Number,
            default: 0,
            min: 0,
        },
        legendary: {
            type: Number,
            default: 0,
            min: 0,
        },
        ascended: {
            type: Number,
            default: 0,
            min: 0,
        },
        sets: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    gear: {
        helmet: ItemSchema,
        gloves: ItemSchema,
        armor: ItemSchema,
        weapon: ItemSchema,
        shield: ItemSchema,
        boots: ItemSchema,
        amulet: ItemSchema,
        ring: ItemSchema,
        rune: ItemSchema,
    },
    backpack: [ItemSchema],
    adventures: {
        wins: {
            type: Number,
            default: 0,
            min: 0,
        },
        losses: {
            type: Number,
            default: 0,
            min: 0,
        },
    }
});

PlayerSchema.methods.getLevel = function () {
    return this.get('level') || 1;
};

PlayerSchema.methods.getHeroClass = function (): string {
    return this.get('class') || 'Hero';
};

PlayerSchema.methods.setHeroClass = function (heroClass: string): string {
    heroClass = heroClass.toLowerCase();
    heroClass = heroClass.charAt(0).toUpperCase() + heroClass.slice(1).trim();

    if (heroClass in ['Berserker', 'Wizard', 'Ranger', 'Cleric', 'Tinkerer']) {
        throw new Error('Unsupported hero class');
    }

    this.heroClass = heroClass;

    return this.save();
};

PlayerSchema.methods.getStat = function (stat: string): number {
    return this.get('stats')[stat] || 0;
};

PlayerSchema.methods.getSkillpoint = function (skillpoint: string) {
    return this.get('skillpoints')[skillpoint] || 0;
};

PlayerSchema.methods.getHeroClassDescription = function () {
    return 'TODO: Berserkers have the option to rage and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure.';
};

PlayerSchema.methods.getHeroClassThumbnail = function () {
    return 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/5cc20b78734ffe0d264885ada90cd961/CLASSBarbarian.JPG';
};

PlayerSchema.methods.getRebirths = function () {
    return this.get('rebirths') || 0;
};

PlayerSchema.methods.getMaxLevel = function () {
    return this.get('maxLevel') || 1;
};

PlayerSchema.methods.getIdFromName = function (id: string) {
    return id.replace(/[!@<>]/g, '');
};

PlayerSchema.methods.hasBeenBanned = function () {
    return this.isBanned;
};

PlayerSchema.methods.setRebirths = function (rebirths: number) {
    this.rebirths = rebirths;

    return this.save();
};

PlayerSchema.methods.setExperience = function (xp: number) {
    this.xp = xp;

    return this.save();
};

PlayerSchema.methods.giveExperience = function (xp: number) {
    if (typeof xp === 'string') {
        xp = parseInt(xp);
    }

    this.xp += xp;

    return this.save();
};

PlayerSchema.methods.setLevel = function (level: number) {
    this.level = level;

    return this.save();
};

PlayerSchema.methods.addCurrency = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    this.currency += amount;

    return this.save();
};

PlayerSchema.methods.makeAdmin = function () {
    this.isAdmin = true;

    return this.save();
};

PlayerSchema.methods.ban = function () {
    this.isBanned = true;

    return this.save();
};

PlayerSchema.methods.unban = function () {
    this.isBanned = false;

    return this.save();
};

const Player = model<IPlayer>('Player', PlayerSchema);

export { Player, PlayerSchema, IPlayer };
