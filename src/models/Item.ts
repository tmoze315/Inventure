import { Console } from 'console';
import { Schema, model, Document } from 'mongoose';

interface IItem extends Document {
    name: string,
    slot: string,
    rarity: string,
    rarityIndex: number,
    owned: number,
    stats: {
    attack: number,
    charisma: number,
    intelligence: number,
    dexterity: number,
    luck: number,
    }
    makeItem: Function,
}

interface IPrefix {
    name: string,
    attack: number,
    charisma: number,
    intelligence: number,
    dexterity: number,
    luck: number,
}

interface ISuffix{
    name: string,
    attack: number,
    charisma: number,
    intelligence: number,
    dexterity: number,
    luck: number,
    the: boolean,
}

interface IEquip{
    name: string,
    attack: number,
    charisma: number,
    intelligence: number,
    dexterity: number,
    luck: number,
    slot: string,
}

interface IMaterial{
  name: string,
  rarity: string,
  rarityIndex: number,
}

const ItemSchema = new Schema({
    name: String,
    slot: String,
    rarity: {
        type: String,
        enum: ['normal', 'rare', 'epic', 'legendary', 'ascended', 'sets'],
    },
    rarityIndex: {
      type: Number,
      default: 0,
      min: 0,
  },
    owned: {
        type: Number,
        default: 0,
        min: 0,
    },
    stats: {
        attack: {
            type: Number,
            default: 0,
            min: -1000,
        },
        intelligence: {
            type: Number,
            default: 0,
            min: -1000,
        },
        charisma: {
            type: Number,
            default: 0,
            min: -1000,
        },
        dexterity: {
            type: Number,
            default: 0,
            min: -1000,
        },
        luck: {
            type: Number,
            default: 0,
            min: -1000,
        },
    },
});

ItemSchema.methods.makeItem = function (type: string, amount: number)
{
let createdItemsArray = [];
const trueAmount = amount;

const prefixes: Array<IPrefix> = [
    {
    name: 'Fine',
    attack: 1,
    charisma: 1,
    dexterity: 1,
    intelligence: 1,
    luck: 1
    },
    {
    name: 'Firm', 
    attack: 2,
    charisma: 0,
    intelligence: 2,
    dexterity: 0,
    luck: 0
    },
    {
    name: 'Patched',
    attack: -1,
    dexterity: 1,
    intelligence: -1,
    luck: 2,
    charisma: 0
    },
    {
    name:'Reforged', 
      attack: 1,
      charisma: 1,
      intelligence: 0,
      dexterity: 0,
      luck: 0,
    },
    {
    name:'Rugged', 
      attack: 2,
      charisma: 2,
      intelligence: 2,
      dexterity: 0,
      luck: 0,
    },
    {
    name:'Savage', 
      attack: 3,
      charisma: -2,
      intelligence: 3,
      dexterity: 0,
      luck: 0,
    },
    {
    name:'Scarred', 
      attack: -2,
      charisma: -2,
      intelligence: -2,
      luck: -2,
      dexterity: 0,
    },
    {
    name: 'Sinister', 
      attack: 4,
      charisma: -2,
      intelligence: -2,
      dexterity: 0,
      luck: 0,
    },
    {
    name:'Tiny', 
      attack: -2,
      charisma: 1,
      dexterity: 2,
      intelligence: -2,
      luck: 0,
    },
    {
    name:'Unholy', 
      charisma: -2,
      intelligence: 3,
      luck: -3,
      attack: 0,
      dexterity: 0,
    },
    {
    name:'Zealous', 
      attack: 2,
      charisma: 2,
      dexterity: 1,
      luck: 0,
      intelligence: 0,
    },
    {
    name:'Cursed', 
      attack: 5,
      charisma: -2,
      dexterity: -3,
      luck: -50,
      intelligence: 0,
    },
    {
    name:'Enchanted',
      attack: 5,
      charisma: 3,
      dexterity: 5,
      intelligence: 0,
      luck: 0,
    },
    {
    name:'Shiny',
    attack: 0,
    intelligence: 0,
    charisma: 3,
    dexterity: 0,
    luck: 0,
    },
    {
    name:'Blessed',
      attack: 2,
      charisma: 4,
      dexterity: 1,
      intelligence: 8,
      luck: 12
    },
    {
    name:'Godly',
      attack: 8,
      charisma: 8,
      dexterity: 8,
      intelligence: 8,
      luck: 8
    },
    {
    name:'Ultimate',
      attack: 12,
      charisma: 12,
      dexterity: 12,
      intelligence: 12,
      luck: 12
    },
    {
    name:'Fancy',
    attack: 0,
    dexterity: 0,
    intelligence: 0, 
    charisma: 15,
    luck: 0,
    },
    {
    name:'Comfortable',
    attack: 0,
    charisma: 0, 
    dexterity: 15,
    intelligence: 0,
    luck: 0,
    },
    {
    name:'Barbaric',
    attack: 15,
    luck: 0,
    dexterity: 0,
    intelligence: 0,
    charisma: 0,
    },
    {
    name:'Strange', 
    intelligence: 15,
    attack: 0,
    charisma: 0,
    dexterity: 0,
    luck: 0,
    },
    {
    name:'Lucky',
    attack: 0,
    intelligence: 0,
    charisma: 0,
    dexterity: 0,
    luck: 15
    },
    {
    name:'Celestial', 
      attack: 5,
      charisma: 10,
      dexterity: 2,
      intelligence: 16,
      luck: 20
    },
    {
    name:'Demonic', 
      attack: 18,
      charisma: 10,
      dexterity: 2,
      intelligence: 5,
      luck: 10
    }
];

const suffixes: Array<ISuffix> = [

{
    name: 'Adventure', 
    attack: 3,
    charisma: 3,
    dexterity: 3,
    intelligence: 3,
    luck: 3,
    the: false,
  },
  {
    name: 'Clarity', 
    charisma: 2,
    dexterity: 2,
    intelligence: 3,
    luck: 1,
    the: false,
    attack: 0,
  },
  {
    name: 'Eternity', 
    attack: 2,
    intelligence: 4,
    luck: 2,
    the: false,
    charisma: 0,
    dexterity: 0,
  },
  {
    name: 'Extinction', 
    attack: 3,
    charisma: -2,
    intelligence: 3,
    the: false,
    luck: 0,
    dexterity: 0,
  },
  {
    name: 'Fools', 
    charisma: 2,
    the: false,
    attack: 0,
    intelligence: 0,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'Fury', 
    attack: 4,
    intelligence: 2,
    the: false,
    charisma: 0,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'Kings', 
    attack: 2,
    intelligence: 2,
    luck: 3,
    the: false,
    charisma: 0,
    dexterity: 0,
  },
  {
    name: 'Memories', 
    intelligence: 3,
    attack: 0,
    luck: 0,
    charisma: 0,
    dexterity: 0,
    the: false,
  },
  {
    name: 'Stealth', 
    dexterity: 4,
    luck: 2,
    the: false,
    attack: 0,
    charisma: 0,
    intelligence: 0,
  },
  {
    name: 'Suffering', 
    attack: 2,
    charisma: 1,
    intelligence: 2,
    dexterity: 2,
    the: false,
    luck: 0,
  },
  {
    name: 'Resilience', 
    attack: 3,
    charisma: 1,
    intelligence: 1,
    the: false,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'West', 
    the: true,
    attack: 0,
    charisma: 0,
    intelligence: 0,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'Supreme One', 
    the: true,
    attack: 15,
    charisma: 15,
    intelligence: 15,
    dexterity: 15,
    luck: 0,
  },
  {
    name: 'Destiny', 
    luck: 12,
    the: false,
    attack: 0,
    charisma: 0,
    intelligence: 0,
    dexterity: 0,
  },
  {
    name: 'Fate', 
    luck: 10,
    the: false,
    attack: 0,
    charisma: 0,
    intelligence: 0,
    dexterity: 0,
  },
  {
    name: 'champions', 
    attack: 12,
    the: false,
    charisma: 0,
    intelligence: 0,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'Conquerors', 
    attack: 10,
    charisma: -12,
    the: false,
    intelligence: 0,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'Wisdom',
    intelligence: 12,
    the: false,
    attack: 0,
    charisma: 0,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'Sage', 
    the: true,
    intelligence: 10,
    attack: 0,
    charisma: 0,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'Mind', 
    the: true,
    charisma: 12,
    attack: 0,
    luck: 0,
    intelligence: 0,
    dexterity: 0,
  },
  {
    name: 'Priest', 
    the: true,
    charisma: 10,
    attack: 0,
    intelligence: 0,
    dexterity: 0,
    luck: 0,
  },
  {
    name: 'Nimble', 
    the: true,
    dexterity: 12,
    attack: 0,
    charisma: 0,
    intelligence: 0,
    luck: 0,
  },
  {
    name: 'Thief', 
    the: true,
    dexterity: 10,
    attack: 0,
    charisma: 0,
    intelligence: 0,
    luck: 0,
  }
];

const equipment: Array<IEquip> = [
{
    name : 'Band',
    slot: 'belt', 
    dexterity: 1,
    intelligence: 1,
    charisma: 0,
    luck: 0,
    attack: 0,
},
{
    name : 'Belt',
    slot: 'belt', 
    dexterity: 1,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 1,
},
{
    name : 'Cord',
    slot: 'belt', 
    dexterity: 2,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 0,
},
{
    name : 'Strap',
    slot: 'belt', 
    dexterity: 0,
    intelligence: 2,
    charisma: 0,
    luck: 0,
    attack: 2,
},
{
    name : 'Waistband',
    slot: 'belt', 
    dexterity: 0,
    intelligence: 1,
    charisma: 0,
    luck: 0,
    attack: 1,
},
{
    name : 'Boots',
    slot: 'boots', 
    dexterity: -1,
    intelligence: 1,
    charisma: 0,
    luck: 0,
    attack: 1,
},
{
    name : 'Clogs',
    slot: 'boots', 
    dexterity: 0,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 0,
},
{
    name : 'Sabatons',
    slot: 'boots', 
    dexterity: -1,
    intelligence: 2,
    charisma: 2,
    luck: 0,
    attack: 2,
},
{
    name : 'Slip-Ons',
    slot: 'boots', 
    dexterity: 1,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 0,
},
{
    name : 'Stompers',
    slot: 'boots', 
    dexterity: 0,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 2,
},
{
    name : 'Amulet',
    slot: 'charm', 
    dexterity: 0,
    intelligence: 2,
    charisma: 1,
    luck: 1,
    attack: 1,
},
{
    name : 'Charm',
    slot: 'charm', 
    dexterity: 0,
    intelligence: 1,
    charisma: 3,
    luck: 1,
    attack: 1,
},
{
    name : 'Medallion',
    slot: 'charm', 
    dexterity: 0,
    intelligence: 2,
    charisma: 1,
    luck: 0,
    attack: 2,
},
{
    name : 'Shard',
    slot: 'charm', 
    dexterity: 1,
    intelligence: 3,
    charisma: 0,
    luck: 2,
    attack: 3,
},
{
    name : 'Armor',
    slot: 'chest', 
    dexterity: 0,
    intelligence: 0,
    charisma: 1,
    luck: 0,
    attack: 1,
},
{
    name : 'Battackleplate',
    slot: 'chest', 
    dexterity: -2,
    intelligence: 2,
    charisma: 1,
    luck: 0,
    attack: 3,
},
{
    name : 'Chestplate',
    slot: 'chest', 
    dexterity: -1,
    intelligence: 2,
    charisma: 2,
    luck: 1,
    attack: 2,
},
{
    name : 'Robes',
    slot: 'chest', 
    dexterity: 2,
    intelligence: 2,
    charisma: 0,
    luck: 2,
    attack: 0,
},
{
    name : 'Vest',
    slot: 'chest', 
    dexterity: 3,
    intelligence: 1,
    charisma: 1,
    luck: 1,
    attack: 1,
},
{
    name : 'Fists',
    slot: 'gloves', 
    dexterity: 2,
    intelligence: -2,
    charisma: -1,
    luck: 0,
    attack: 2,
},
{
    name : 'Gauntlets',
    slot: 'gloves', 
    dexterity: -1,
    intelligence: 2,
    charisma: 1,
    luck: 0,
    attack: 2,
},
{
    name : 'Gloves',
    slot: 'gloves', 
    dexterity: 1,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 0,
},
{
    name : 'Grips',
    slot: 'gloves', 
    dexterity: 0,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 1,
},
{
    name : 'Crown',
    slot: 'head', 
    dexterity: 2,
    intelligence: 3,
    charisma: 3,
    luck: 2,
    attack: 1,
},
{
    name : 'Faceguard',
    slot: 'head', 
    dexterity: 2,
    intelligence: 0,
    charisma: 0,
    luck: 1,
    attack: 1,
},
{
    name : 'Greathelm',
    slot: 'head', 
    dexterity: -1,
    intelligence: 2,
    charisma: 0,
    luck: 0,
    attack: 2,
},
{
    name : 'Jaws',
    slot: 'head', 
    dexterity: 0,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 2,
},
{
    name : 'Mask',
    slot: 'head', 
    dexterity: 0,
    intelligence: 1,
    charisma: 0,
    luck: 0,
    attack: 1,
},
{
    name : 'Defender',
    slot: 'left', 
    dexterity: -2,
    intelligence: 1,
    charisma: 1,
    luck: 0,
    attack: 3,
},
{
    name : 'Deflector',
    slot: 'left', 
    dexterity: 0,
    intelligence: 2,
    charisma: 0,
    luck: 0,
    attack: 2,
},
{
    name : 'Shield',
    slot: 'left', 
    dexterity: 0,
    intelligence: 1,
    charisma: 1,
    luck: 0,
    attack: 1,
},
{
    name : 'Spellbook',
    slot: 'left', 
    dexterity: 2,
    intelligence: 3,
    charisma: 2,
    luck: 2,
    attack: 0,
},
{
    name : 'Tome',
    slot: 'left', 
    dexterity: -2,
    intelligence: 2,
    charisma: 0,
    luck: 2,
    attack: 0,
},
{
    name : 'charismaps',
    slot: 'legs', 
    dexterity: 1,
    intelligence: 1,
    charisma: 1,
    luck: 0,
    attack: 1,
},
{
    name : 'Guards',
    slot: 'legs', 
    dexterity: 0,
    intelligence: 2,
    charisma: 0,
    luck: 0,
    attack: 2,
},
{
    name : 'Leggings',
    slot: 'legs', 
    dexterity: 1,
    intelligence: 0,
    charisma: 0,
    luck: 1,
    attack: 0,
},
{
    name : 'Legplates',
    slot: 'legs', 
    dexterity: 0,
    intelligence: 2,
    charisma: 1,
    luck: 0,
    attack: 2,
},
{
    name : 'Skins',
    slot: 'legs', 
    dexterity: 2,
    intelligence: 1,
    charisma: 0,
    luck: 0,
    attack: 1,
},
{
    name : 'charismain',
    slot: 'neck', 
    dexterity: 1,
    intelligence: 2,
    charisma: 0,
    luck: 1,
    attack: 2,
},
{
    name : 'Collar',
    slot: 'neck', 
    dexterity: 0,
    intelligence: 1,
    charisma: 0,
    luck: 0,
    attack: 1,
},
{
    name : 'Necklace',
    slot: 'neck', 
    dexterity: 2,
    intelligence: 3,
    charisma: 2,
    luck: 2,
    attack: 3,
},
{
    name : 'Axe',
    slot: 'right', 
    dexterity: 0,
    intelligence: 0,
    charisma: -1,
    luck: 0,
    attack: 1,
},
{
    name : 'Dagger',
    slot: 'right', 
    dexterity: 2,
    intelligence: 0,
    charisma: 0,
    luck: 1,
    attack: 2,
},
{
    name : 'Katana',
    slot: 'right', 
    dexterity: 0,
    intelligence: 0,
    charisma: 1,
    luck: 0,
    attack: 2,
},
{
    name : 'Quarterstaff',
    slot: 'right', 
    dexterity: 2,
    intelligence: 2,
    charisma: 0,
    luck: 1,
    attack: 0,
},
{
    name : 'Sword',
    slot: 'right', 
    dexterity: 0,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 2,
},
{
    name : 'Ring',
    slot: 'ring', 
    dexterity: 1,
    intelligence: 2,
    charisma: 1,
    luck: 1,
    attack: 2,
},
{
    name : 'Ringlet',
    slot: 'ring', 
    dexterity: 0,
    intelligence: 1,
    charisma: 1,
    luck: 0,
    attack: 1,
},
{
    name : 'Battacklestaff',
    slot: 'two handed', 
    dexterity: 0,
    intelligence: 5,
    charisma: 3,
    luck: 2,
    attack: 0,
},
{
    name : 'Crossbow',
    slot: 'two handed', 
    dexterity: 3,
    intelligence: 0,
    charisma: 2,
    luck: 2,
    attack: 4,
},
{
    name : 'Greatsword',
    slot: 'two handed', 
    dexterity: 0,
    intelligence: 0,
    charisma: 2,
    luck: 0,
    attack: 4,
},
{
    name : 'Staff',
    slot: 'two handed', 
    dexterity: 1,
    intelligence: 3,
    charisma: 1,
    luck: 1,
    attack: 0,
},
{
    name : 'Warhammer',
    slot: 'two handed', 
    dexterity: -2,
    intelligence: 0,
    charisma: 0,
    luck: 0,
    attack: 5,
},


];

const normalMaterial: Array<IMaterial> = [
  {
    name: 'Cloth',
    rarity: 'normal',
    rarityIndex: 0,
  },
  {
    name: 'Linen',
    rarity: 'normal',
    rarityIndex: 0,
  },
  {
    name: 'Silk',
    rarity: 'normal',
    rarityIndex: 0,
  },
  {
    name: 'Fur',
    rarity: 'normal',
    rarityIndex: 1,
  },
  {
    name: 'Dwarven',
    rarity: 'normal',
    rarityIndex: 2,
  },
  {
    name: 'Hide',
    rarity: 'normal',
    rarityIndex: 1,
  },
  {
    name: 'Steel',
    rarity: 'normal',
    rarityIndex: 1,
  },
];
const rareMaterial: Array<IMaterial> = [
  {
    name: 'Bronze',
    rarity: 'rare',
    rarityIndex: 2,
  },
  {
    name: 'Iron',
    rarity: 'rare',
    rarityIndex: 3,
  },
  {
    name: 'Bone',
    rarity: 'rare',
    rarityIndex: 2,
  },
  {
    name: 'Gold',
    rarity: 'rare',
    rarityIndex: 3,
  },
  {
    name: 'Silver',
    rarity: 'rare',
    rarityIndex: 2,
  },
  {
    name: 'Elven',
    rarity: 'rare',
    rarityIndex: 3,
  },
  {
    name: 'Quicksilver',
    rarity: 'rare',
    rarityIndex: 4,
  },  
  {
    name: 'Platinum',
    rarity: 'rare',
    rarityIndex: 2,
  },
];

const epicMaterial: Array<IMaterial> = [
  {
    name: 'Ruby',
    rarity: 'epic',
    rarityIndex: 4,
  },
  {
    name: 'Duranium',
    rarity: 'epic',
    rarityIndex: 5,
  },
  {
    name: 'Mithril',
    rarity: 'epic',
    rarityIndex: 4,
  },
  {
    name: 'Obsidian',
    rarity: 'epic',
    rarityIndex: 5,
  },
  {
    name: 'Titanium',
    rarity: 'epic',
    rarityIndex: 4,
  },
  {
    name: 'Adamantite',
    rarity: 'epic',
    rarityIndex: 6,
  },
  {
    name: 'Ebony',
    rarity: 'epic',
    rarityIndex: 7,
  },
  {
    name: 'Diamond-Studded',
    rarity: 'epic',
    rarityIndex: 5,
  },
];

const legendaryMaterial: Array<IMaterial> = [
  {
    name: 'Dragonscale',
    rarity: 'legendary',
    rarityIndex: 12,
  },
  {
    name: 'Dalekanium',
    rarity: 'legendary',
    rarityIndex: 11,
  },
  {
    name: 'Tritanium',
    rarity: 'legendary',
    rarityIndex: 11,
  },
  {
    name: 'Runite',
    rarity: 'legendary',
    rarityIndex: 10,
  },
  {
    name: 'Vibranium',
    rarity: 'legendary',
    rarityIndex: 12,
  },
  {
    name: 'Draconium',
    rarity: 'legendary',
    rarityIndex: 14,
  },
  {
    name: 'Dragonplate',
    rarity: 'legendary',
    rarityIndex: 13,
  },
  {
    name: 'Cobalt',
    rarity: 'legendary',
    rarityIndex: 12,
  },
  {
    name: 'Obsidium',
    rarity: 'legendary',
    rarityIndex: 11,
  },
  {
    name: 'Nanite',
    rarity: 'legendary',
    rarityIndex: 15,
  },
  {
    name: 'Unknown',
    rarity: 'legendary',
    rarityIndex: 20,
  },
];

const ascendedMaterial: Array<IMaterial> = [
  {
    name: 'Cloth',
    rarity: 'ascended',
    rarityIndex: 5,
  },
  {
    name: 'Linen',
    rarity: 'ascended',
    rarityIndex: 5,
  },
  {
    name: 'Silk',
    rarity: 'ascended',
    rarityIndex: 5,
  },
  {
    name: 'Fur',
    rarity: 'ascended',
    rarityIndex: 6,
  },
  {
    name: 'Dwarven',
    rarity: 'ascended',
    rarityIndex: 7,
  },
  {
    name: 'Hide',
    rarity: 'ascended',
    rarityIndex: 6,
  },
  {
    name: 'Steel',
    rarity: 'ascended',
    rarityIndex: 6,
  },
  {
    name: 'Bronze',
    rarity: 'ascended',
    rarityIndex: 7,
  },
  {
    name: 'Iron',
    rarity: 'ascended',
    rarityIndex: 8,
  },
  {
    name: 'Bone',
    rarity: 'ascended',
    rarityIndex: 7,
  },
  {
    name: 'Gold',
    rarity: 'ascended',
    rarityIndex: 8,
  },
  {
    name: 'Silver',
    rarity: 'ascended',
    rarityIndex: 7,
  },
  {
    name: 'Elven',
    rarity: 'ascended',
    rarityIndex: 8,
  },
  {
    name: 'Quicksilver',
    rarity: 'ascended',
    rarityIndex: 9,
  },
  {
    name: 'Platinum',
    rarity: 'ascended',
    rarityIndex: 7,
  },
  {
    name: 'Ruby',
    rarity: 'ascended',
    rarityIndex: 9,
  },
  {
    name: 'Duranium',
    rarity: 'ascended',
    rarityIndex: 10,
  },
  {
    name: 'Mithril',
    rarity: 'ascended',
    rarityIndex: 9,
  },
  {
    name: 'Obsidian',
    rarity: 'ascended',
    rarityIndex: 10,
  },
  {
    name: 'Titanium',
    rarity: 'ascended',
    rarityIndex: 9,
  },
  {
    name: 'Adamantite',
    rarity: 'ascended',
    rarityIndex: 11,
  },
  {
    name: 'Ebony',
    rarity: 'ascended',
    rarityIndex: 12,
  },
  {
    name: 'Diamond-Studded',
    rarity: 'ascended',
    rarityIndex: 10,
  },
  {
    name: 'Dragonscale',
    rarity: 'ascended',
    rarityIndex: 17,
  },
  {
    name: 'Dalekanium',
    rarity: 'ascended',
    rarityIndex: 16,
  },
  {
    name: 'Tritanium',
    rarity: 'ascended',
    rarityIndex: 16,
  },
  {
    name: 'Runite',
    rarity: 'ascended',
    rarityIndex: 15,
  },
  {
    name: 'Vibranium',
    rarity: 'ascended',
    rarityIndex: 17,
  },
  {
    name: 'Draconium',
    rarity: 'ascended',
    rarityIndex: 19,
  },
  {
    name: 'Dragonplate',
    rarity: 'ascended',
    rarityIndex: 18,
  },
  {
    name: 'Cobalt',
    rarity: 'ascended',
    rarityIndex: 17,
  },
  {
    name: 'Obsidium',
    rarity: 'ascended',
    rarityIndex: 16,
  },
  {
    name: 'Nanite',
    rarity: 'ascended',
    rarityIndex: 20,
  },
  {
    name: 'Unknown',
    rarity: 'ascended',
    rarityIndex: 30,
  },
];




for (let i = 0; i < trueAmount; i++) {

//let selectedNormalMaterialChance = Math.floor(Math.random() * normalMaterial.length);
//let selectedRareMaterialChance = Math.floor(Math.random() * rareMaterial.length);
//let selectedEpicMaterialChance = Math.floor(Math.random() * epicMaterial.length);
//let selectedLegendaryMaterialChance = Math.floor(Math.random() * legendaryMaterial.length);
//let selectedAscendedMaterialChance = Math.floor(Math.random() * ascendedMaterial.length);

let selectedRarity = type.toLowerCase();
let randomMaterial = 0;

const options: Array<String> = ['normal', 'rare', 'epic', 'legendary', 'ascended'];

    if (!options.includes(selectedRarity)) {
        throw new Error('Invalid chest type!');
        return;
    }
    if(selectedRarity == 'normal'){
        selectedRarity = 'normalMaterial';
        randomMaterial = Math.floor(Math.random() * normalMaterial.length);
    }
    if(selectedRarity == 'rare'){
      selectedRarity = 'rareMaterial';
      randomMaterial = Math.floor(Math.random() * rareMaterial.length);
    }
    if(selectedRarity == 'epic'){
      selectedRarity = 'epicMaterial';
      randomMaterial = Math.floor(Math.random() * epicMaterial.length);
    }
    if(selectedRarity == 'legendary'){
      selectedRarity = 'legendaryMaterial';
      randomMaterial = Math.floor(Math.random() * legendaryMaterial.length);
    }
    if(selectedRarity == 'ascended'){
      selectedRarity = 'ascendedMaterial';
      randomMaterial = Math.floor(Math.random() * ascendedMaterial.length);
    }

let randomPrefix = Math.floor(Math.random() * prefixes.length);
let randomMaterials = Math.floor(Math.random() * suffixes.length);
let randomEquipment = Math.floor(Math.random() * equipment.length);


let selectedPrefix = prefixes[randomPrefix];
let selectedSuffixes = suffixes[randomMaterials];
let selectedEquipment = equipment[randomEquipment];
let selectedMaterial = normalMaterial[randomMaterial];

if(selectedRarity == 'normalMaterial'){
  selectedMaterial = normalMaterial[randomMaterial];
}
if(selectedRarity == 'rareMaterial'){
  selectedMaterial = rareMaterial[randomMaterial];
}
if(selectedRarity == 'epicMaterial'){
  selectedMaterial = epicMaterial[randomMaterial];
}
if(selectedRarity == 'legendaryMaterial'){
  selectedMaterial = legendaryMaterial[randomMaterial];
}
if(selectedRarity == 'ascendedMaterial'){
  selectedMaterial = ascendedMaterial[randomMaterial];
}

let isThe = ' ';



if(selectedSuffixes.the){
    isThe = ' the ';
}
// console.log(selectedMaterial.name);

let finishedName = (selectedPrefix.name + ' ' + selectedMaterial.name + ' ' + selectedEquipment.name + ' ' + 'of' + `${isThe}`  + selectedSuffixes.name);
let slot = selectedEquipment.slot;

let rarity = selectedMaterial.rarity;
let rarityIndex = selectedMaterial.rarityIndex;

let owned = 0;

let totalAtt = Math.round(selectedPrefix.attack + selectedEquipment.attack + selectedSuffixes.attack);
let totalInt = Math.round(selectedPrefix.intelligence + selectedEquipment.intelligence + selectedSuffixes. intelligence);
let totalCha = Math.round(selectedPrefix.charisma + selectedEquipment.charisma + selectedSuffixes. charisma);
let totalLuck = Math.round(selectedPrefix.luck + selectedEquipment.luck + selectedSuffixes. luck);
let totalDex = Math.round(selectedPrefix.dexterity + selectedEquipment.dexterity + selectedSuffixes. dexterity);

if(rarityIndex > 0)
{
totalAtt = Math.round(((selectedPrefix.attack + selectedEquipment.attack + selectedSuffixes.attack) * (selectedMaterial.rarityIndex / 2)));
totalInt = Math.round(((selectedPrefix.intelligence + selectedEquipment.intelligence + selectedSuffixes. intelligence) * (selectedMaterial.rarityIndex / 2)));
totalCha = Math.round(((selectedPrefix.charisma + selectedEquipment.charisma + selectedSuffixes. charisma) * (selectedMaterial.rarityIndex / 2)));
totalLuck = Math.round(((selectedPrefix.luck + selectedEquipment.luck + selectedSuffixes. luck) * (selectedMaterial.rarityIndex / 2)));
totalDex = Math.round(((selectedPrefix.dexterity + selectedEquipment.dexterity + selectedSuffixes. dexterity) * (selectedMaterial.rarityIndex / 2)));
}

const item = <IItem>{
    name: finishedName,
    slot,
    rarity,
    rarityIndex,
    owned,
    stats: {
    attack: totalAtt,
    charisma: totalCha,
    intelligence: totalInt,
    dexterity: totalDex,
    luck: totalLuck,
    }
  }

  createdItemsArray.push(item);

}

return createdItemsArray;

}
const Item = model<IItem>('Item', ItemSchema);

export { Item, ItemSchema, IItem };


