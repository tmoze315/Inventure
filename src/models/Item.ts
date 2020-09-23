import { Schema, model } from 'mongoose';

const Item = new Schema({
    name: String,
    slot: String,
    rarity: {
        type: String,
        enum: ['normal', 'rare', 'epic', 'legendary', 'ascended', 'sets'],
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
        dexterity: {
            type: Number,
            default: 0,
            min: 0,
        },
        luck: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
});

export default model('Item', Item);
