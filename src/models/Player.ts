import { Schema, model, Document } from 'mongoose';
import { IEnemy } from '../interfaces/enemy';
import { ItemSchema } from './Item';
import { PlayerAttack } from '../commands/adventure-commands';
import { IArea } from '../areas/base-area';

interface IPlayer extends Document {
    id: string,
    guildId: string,
    username: string,
    isAdmin: Boolean,
    class: string,
    background: string,
    experience: number,
    level: number,
    maxLevel: number,
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
    attackEnemy: Function,
    getCritAmount: Function,
    handleExperience: Function,
    gainXpAfterKillingEnemy: Function,
    rebirth: Function,
    removeCurrency: Function,
    gainGoldAfterKillingEnemy: Function,
    loseGoldAfterLosingToEnemy: Function,
    getExperienceNeededForLevel: Function,
    getLevelForCurrentExperience: Function,
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
    maxLevel: {
        type: Number,
        default: 10,
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

PlayerSchema.methods.setHeroClass = function (heroClass: string) {
    heroClass = heroClass.toLowerCase();
    const newHeroClass = heroClass.charAt(0).toUpperCase() + heroClass.slice(1).trim();
    const options: Array<String> = ['Berserker', 'Wizard', 'Ranger', 'Cleric', 'Tinkerer'];

    if (!options.includes(newHeroClass)) {
        throw new Error('Invalid hero class');
    }

    this.class = newHeroClass;

    return this.save();
};

PlayerSchema.methods.getStat = function (stat: string): number {
    return this.get('stats')[stat] || 0;
};

PlayerSchema.methods.getSkillpoint = function (skillpoint: string) {
    return this.get('skillpoints')[skillpoint] || 0;
};

PlayerSchema.methods.getHeroClassDescription = function () {

    if (!this.class) {
        return 'All heroes are destined for greatness, your journey begins now. When you reach level 10 you can choose your path and select a heroclass.';
    }

    if (this.class === 'Berserker') {
        return 'Berserkers have the option to rage and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure.';
    }

    if (this.class === 'Wizard') {
        return `Wizards have the option to focus and add large bonuses to their magic, but their focus can sometimes go astray...
    Use the focus command when attacking in an adventure.`;
    }

    if (this.class === 'Ranger') {
        return `Rangers can gain a special pet, which can find items and give reward bonuses.
    Use the pet command to see pet options.`;
    }

    if (this.class === 'Tinkerer') {
        return `Tinkerers can forge two different items into a device bound to their very soul.
    Use the forge command.`;
    }

    if (this.class === 'Cleric') {
        return `Clerics can bless the entire group when praying.
    Use the bless command when fighting in an adventure.`;
    }
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
    const newId = id.replace(/[!@<>]/g, '');
    return newId;
};

PlayerSchema.methods.hasBeenBanned = function () {
    return this.isBanned;
};

PlayerSchema.methods.setRebirths = function (rebirths: number) {
    this.rebirths = rebirths;

    return this.save();
};

PlayerSchema.methods.setExperience = async function (experience: number) {
    this.experience = experience;

    await this.handleLevelUp();

    return this.save();
};

PlayerSchema.methods.giveExperience = async function (experience: number) {
    if (typeof experience === 'string') {
        experience = parseInt(experience);
    }

    this.experience += experience;

    await this.handleLevelUp();

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

    this.currency = Math.ceil(this.currency + amount);

    return this.save();
};

PlayerSchema.methods.removeCurrency = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    this.currency -= Math.ceil(amount);

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

PlayerSchema.methods.attackEnemy = function (enemy: IEnemy, action: String) {
    let roll = Math.floor(Math.random() * 50);

    if (roll === 0) {
        roll = 1;
    }

    if (action === 'attack') {
        const damage = ((this.getStat('attack') + roll) + this.rebirths);

        return <PlayerAttack>{
            player: this,
            roll: roll,
            baseDamage: damage,
            critDamage: 10,
            totalDamage: damage
        };
    }
    if (action === 'spell') {
        const damage = ((this.getStat('intelligence') + roll) + this.rebirths);

        return <PlayerAttack>{
            player: this.toObject(),
            roll: roll,
            baseDamage: damage,
            critDamage: 10,
            totalDamage: damage,
        };
    }
}

PlayerSchema.methods.gainXpAfterKillingEnemy = async function (enemy: IEnemy, area: IArea) {
    const xpGained = enemy.baseHp * enemy.xpMultiplier * area.xpMultiplier;

    await this.giveExperience(xpGained);

    return xpGained;
};

PlayerSchema.methods.gainGoldAfterKillingEnemy = async function (enemy: IEnemy, area: IArea) {
    const goldGained = (enemy.baseHp * 10) * enemy.goldMultiplier * area.goldMultiplier;

    await this.addCurrency(goldGained);

    return goldGained;
}

PlayerSchema.methods.loseGoldAfterLosingToEnemy = async function (enemy: IEnemy, area: IArea) {
    const goldLost = enemy.baseHp * enemy.goldMultiplier * area.goldMultiplier * 0.3;

    await this.removeCurrency(goldLost);

    return goldLost;
}

PlayerSchema.methods.getExperienceNeededForLevel = function (level: number) {
    return Math.ceil(Math.pow(level, 3.5));
}

PlayerSchema.methods.getLevelForCurrentExperience = function (enemy: IEnemy, area: IArea) {
    // https://stackoverflow.com/a/9309300/405529
    return Math.ceil(Math.pow(this.experience, 1 / 3.5));
}

PlayerSchema.methods.handleLevelUp = async function () {
    const levelForCurrentExperience = this.getLevelForCurrentExperience();
    let newLevel = levelForCurrentExperience;

    if (levelForCurrentExperience > this.maxLevel) {
        this.experience = this.getExperienceNeededForLevel(this.maxLevel);

        newLevel = this.maxLevel;
    }

    this.level = newLevel;

    return this.save();
};

PlayerSchema.methods.rebirth = async function () {
    if (this.level < this.maxLevel) {
        throw new Error('Cannot rebirth');
    }

    this.experience = 1;
    this.level = 1;

    this.rebirths += 1
    this.maxLevel += 10;

    return this.save();
};

const Player = model<IPlayer>('Player', PlayerSchema);

export { Player, PlayerSchema, IPlayer };
