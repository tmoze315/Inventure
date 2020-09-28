
import { Schema, model, Document } from 'mongoose';

interface IAdventureResult extends Document {
    damage: number,
    totalParticipants: number,
    wasSuccessful: boolean,
}

const AdventureResultSchema = new Schema({
    // mainAction: String,
    damage: Number,
    totalParticipants: Number,
    wasSuccessful: Boolean,
});

// Put all adventure results into the database in: results table NOT guild

// USE MEDIAN NOT MEAN/AVERAGE

const AdventureResult = model<IAdventureResult>('AdventureResult', AdventureResultSchema);

export { AdventureResult, AdventureResultSchema, IAdventureResult };
