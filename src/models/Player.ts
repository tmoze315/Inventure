import { Schema, model, Document } from 'mongoose';
import { IEnemy } from '../interfaces/enemy';
import { ItemSchema } from './Item';
import { PlayerAttack } from '../commands/adventure-commands';
import { IArea } from '../areas/base-area';
import { getHeroClass, getHeroClassOrFail, HeroClass } from '../config/hero-classes';

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
    postBattleRewards: Function,
    handleSkillpointRewards: Function,
    useSkillpoints: Function,
}

type Skillpoint = 'attack' | 'intelligence' | 'charisma';

interface RewardResult {
    player: IPlayer,
    xpRoll: number,
    goldRoll: number,
    xpBonusPercentage: number,
    goldBonusPercentage: number,
    baseGold: number,
    baseXp: number,
    totalGold: number,
    totalXp: number,
}

interface EarnedSkillpoints {
    player: IPlayer,
    level: number,
    totalSkillpoints: number,
    levelUp: boolean,
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

PlayerSchema.methods.getHeroClass = function (): HeroClass {
    return getHeroClass(this.class);
};

PlayerSchema.methods.setHeroClass = function (heroClass: string) {
    const heroClassObject: HeroClass = getHeroClassOrFail(heroClass);

    this.class = heroClassObject.name;

    return this.save();
};

PlayerSchema.methods.getStat = function (stat: string): number {
    return this.get('stats')[stat] || 0;
};

PlayerSchema.methods.getSkillpoint = function (skillpoint: string) {
    return this.get('skillpoints')[skillpoint] || 0;
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
    this.experience = this.getExperienceNeededForLevel(this.level);

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

PlayerSchema.methods.attackEnemy = function (enemy: IEnemy, action: String, area: IArea) {
    let roll = Math.floor(Math.random() * 50);

    const goldLoss = Math.round(enemy.baseHp * enemy.goldMultiplier * area.goldMultiplier * 0.3);

    if (roll === 0) {
        roll = 1;
    }

    if (action === 'attack') {
        const attSkillPoints = this.get(`skillpoints.attack`);

        const damage = ((this.getStat('attack') + roll + attSkillPoints) + this.rebirths);
        const baseDamage = (this.getStat('attack') + attSkillPoints);

        return <PlayerAttack>{
            player: this,
            roll: roll,
            baseDamage: baseDamage,
            critDamage: 10,
            totalDamage: damage,
            goldLoss,
        };
    }
    if (action === 'spell') {
        const intSkillPoints = this.get(`skillpoints.intelligence`);

        const damage = ((this.getStat('intelligence') + roll + intSkillPoints) + this.rebirths);
        const baseDamage = (this.getStat('intelligence') + intSkillPoints);

        return <PlayerAttack>{
            player: this.toObject(),
            roll: roll,
            baseDamage: baseDamage,
            critDamage: 10,
            totalDamage: damage,
            goldLoss,
        };
    }
}

PlayerSchema.methods.gainXpAfterKillingEnemy = async function (enemy: IEnemy, area: IArea, rewardresult: RewardResult) {
    const xpGained = rewardresult.totalXp;

    await this.giveExperience(xpGained);

    return xpGained;
};

PlayerSchema.methods.gainGoldAfterKillingEnemy = async function (enemy: IEnemy, area: IArea, rewardresult: RewardResult) {
    const goldGained = rewardresult.totalGold;

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

    return newLevel;
};

PlayerSchema.methods.handleSkillpointRewards = async function (startLevel: number, endLevel: number, player: IPlayer) {

    let allPassedLevels = [];
    let sumEven = 0;
    let levelUp = false;

    for (let i = startLevel + 1; i <= endLevel; i++) {
        allPassedLevels.push(i);
    }

    if (allPassedLevels.length > 0) {
        for (let i = 0; i <= allPassedLevels.length; i++) {
            if (allPassedLevels[i] % 2 === 0) {
                sumEven++;
            }
        }
    }
    const currentPoints = this.get(`skillpoints.unspent`);
    const newPoints = this.set(`skillpoints.unspent`, (sumEven + Number(currentPoints)));

    if (startLevel < endLevel) {
        levelUp = true;
    }
    else {
        levelUp = false;
    }
    const save = this.save();

    return <EarnedSkillpoints>{
        player: this,
        level: endLevel,
        totalSkillpoints: sumEven,
        levelUp: levelUp,
    }
};


PlayerSchema.methods.rebirth = async function () {
    if (this.level < this.maxLevel) {
        throw new Error('Cannot rebirth');
    }

    this.set('skillpoints.attack', 0);
    this.set('skillpoints.charisma', 0);
    this.set('skillpoints.intelligence', 0);

    this.set('stats.attack', 1);
    this.set('stats.charisma', 1);
    this.set('stats.intelligence', 1);
    this.set('stats.luck', 1);
    this.set('stats.dexterity', 1);
    this.set('stats.unspent', 1);

    this.experience = 1;
    this.level = 1;

    this.rebirths += 1
    this.maxLevel += 10;

    // Give the user more skillpoints to assign each rebirth
    const skillpoints = Math.ceil(Math.pow(this.rebirths, 1.8));

    this.set('skillpoints.unspent', skillpoints);

    return this.save();
};

PlayerSchema.methods.postBattleRewards = function (player: IPlayer, enemy: IEnemy, area: IArea) {

    const goldRoll = Math.floor(Math.random() * 50);
    const xpRoll = Math.floor(Math.random() * 50);
    let bonusGoldPercentage = 0;
    let bonusXpPercentage = 0;
    const baseGold = Math.round((enemy.baseHp * 10)) * enemy.goldMultiplier * area.goldMultiplier;
    const baseXp = Math.round(enemy.baseHp * enemy.xpMultiplier * area.xpMultiplier);

    if (goldRoll >= 20) {
        bonusGoldPercentage = 1.2;
    }

    else if (goldRoll >= 10) {
        bonusGoldPercentage = 1.15;
    }

    else {
        bonusGoldPercentage = 1;
    }

    if (xpRoll >= 20) {
        bonusXpPercentage = 1.2;
    }

    else if (xpRoll >= 10) {
        bonusXpPercentage = 1.15;
    }

    else {
        bonusXpPercentage = 1;
    }

    const totalGold = Math.round(baseGold * bonusGoldPercentage);
    const totalXp = Math.round(baseXp * bonusXpPercentage);


    return <RewardResult>{
        player: player,
        xpRoll: xpRoll,
        goldRoll: goldRoll,
        xpBonusPercentage: bonusXpPercentage,
        goldBonusPercentage: bonusGoldPercentage,
        baseGold: baseGold,
        baseXp: baseXp,
        totalGold: totalGold,
        totalXp: totalXp,
    };
};

PlayerSchema.methods.useSkillpoints = function (skill: Skillpoint, amount: number = 1) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    const currentPoints = this.get(`skillpoints.unspent`);

    if (currentPoints < amount) {
        throw new Error('You do not have enough skill points.');
    }

    const skills: Array<string> = ['attack', 'charisma', 'intelligence'];

    const currentPointsInSkill = parseInt(this.get(`skillpoints.${skill}`));

    this.set(`skillpoints.${skill}`, currentPointsInSkill + amount);
    this.set(`skillpoints.unspent`, currentPoints - amount);

    return this.save();
};

const Player = model<IPlayer>('Player', PlayerSchema);

export { Player, PlayerSchema, IPlayer, RewardResult, EarnedSkillpoints };
