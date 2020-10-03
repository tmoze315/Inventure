import { Schema, model, Document } from 'mongoose';
import { IEnemy } from '../interfaces/enemy';
import { ItemSchema } from './Item';
import { PlayerAttack } from '../commands/adventure-commands';
import { makeRebirthSuccessMessage } from '../messages/rebirth-success';
import { makeRebirthFailureMessage } from '../messages/rebirth-failure';

interface IPlayer extends Document {
    id: string,
    guildId: string,
    username: string,
    isAdmin: Boolean,
    class: string,
    background: string,
    experience: number,
    nextLevelExperience: number,
    maxLevelExperience: number,
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
    postBattleXp: Function,
    rebirth: Function,
    removeCurrency: Function,
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
    nextLevelExperience: {
        type: Number,
        default: 11,
        min: 11,
    },
    maxLevelExperience: {
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

PlayerSchema.methods.setHeroClass = function (heroClass: string){
    heroClass = heroClass.toLowerCase();
    const newHeroClass = heroClass.charAt(0).toUpperCase() + heroClass.slice(1).trim();
    const options: Array<String> = ['Berserker', 'Wizard', 'Ranger', 'Cleric', 'Tinkerer'];

    if (options.includes(newHeroClass)) {
        this.class = newHeroClass;
        return true;
    }
    else{
        return false;
    }

    return this.save();
};

PlayerSchema.methods.getStat = function (stat: string): number {
    return this.get('stats')[stat] || 0;
};

PlayerSchema.methods.getSkillpoint = function (skillpoint: string) {
    return this.get('skillpoints')[skillpoint] || 0;
};

PlayerSchema.methods.getHeroClassDescription = function () {

    if(!this.class)
    {
    return 'All heroes are destined for greatness, your journey begins now. When you reach level 10 you can choose your path and select a heroclass.';
    }

    if(this.class === 'Berserker')
    {
    return 'Berserkers have the option to rage and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure.';
    }

    if(this.class === 'Wizard')
    {
    return `Wizards have the option to focus and add large bonuses to their magic, but their focus can sometimes go astray...
    Use the focus command when attacking in an adventure.`;
    }

    if(this.class === 'Ranger')
    {
    return `Rangers can gain a special pet, which can find items and give reward bonuses.
    Use the pet command to see pet options.`;
    }

    if(this.class === 'Tinkerer')
    {
    return `Tinkerers can forge two different items into a device bound to their very soul.
    Use the forge command.`;
    }

    if(this.class === 'Cleric')
    {
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

    this.currency = (this.currency + amount);

    return this.save();
};

PlayerSchema.methods.removeCurrency = function (amount: number) {
    if (typeof amount === 'string') {
        amount = parseInt(amount);
    }

    this.currency -= amount;

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
    const player = this.id;
    const roll = Math.floor(Math.random() * 50);
    const baseDamage = this.getStat('attack');
    const baseInt = this.getStat('intelligence');
    const attTotalDamage = ((baseDamage + roll) + this.rebirths);
    const spellTotalDamage = ((baseInt + roll) + this.rebirths);

    if (action === 'attack') {
        return <PlayerAttack>{
            player: player,
            roll: roll,
            baseDamage: baseDamage,
            critDamage: 10,
            totalDamage: attTotalDamage,
        };
    }
    if (action === 'spell') {
        return <PlayerAttack>{
            player: player,
            roll: roll,
            baseDamage: baseInt,
            critDamage: 10,
            totalDamage: spellTotalDamage,
        };
    }
}

PlayerSchema.methods.postBattleXp = function (player: IPlayer, enemy: IEnemy,) {
    const newXp = (this.experience + enemy.baseXp);

    player.experience = newXp;
    this.checkExperience(newXp);

    return;
};

PlayerSchema.methods.checkExperience = async function (newXp: number) {
    const newExperience = newXp;
    this.experience = newExperience;

    // If the player levels up
    if (newExperience >= this.nextLevelExperience) {
        const newLevel = (this.level + 1);

        const newLevelAfterCheck = await this.checkLevelUp(newLevel);

        this.level = newLevelAfterCheck;
        const newNextLevelXp = Math.round(Math.pow((newLevelAfterCheck + 1), 3.5));

        this.nextLevelExperience = newNextLevelXp;
        this.checkExperience(newExperience);
        return;
    } else if (newExperience < this.nextLevelExperience) {
        this.experience = newExperience;
    }

    return this.save();
};

PlayerSchema.methods.checkLevelUp = async function (newLevel: number) {
    let newLevelAfterCheck = new Number;

    if (newLevel >= this.maxLevel) {
        newLevelAfterCheck = this.maxLevel;
    } else {
        newLevelAfterCheck = newLevel;
    }

    return newLevelAfterCheck;
};

PlayerSchema.methods.rebirth = async function () {
    let able = false;

    if (this.level >= this.maxLevel) {
        this.maxLevel = this.maxLevel + 10;
        this.level = 0;
        this.rebirths = (this.rebirths + 1);
        able = true;
        return able;
    } else {
        able = false;
        return able;
    }
};

const Player = model<IPlayer>('Player', PlayerSchema);

export { Player, PlayerSchema, IPlayer };
