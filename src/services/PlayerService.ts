import { User } from "discord.js";
import { IPlayer, Player } from "../models/Player";

class PlayerService {
    static async getCurrentPlayer(user: User): Promise<IPlayer | null> {
        return await Player.findOne({ id: user.id }).exec();
    }
}

export default PlayerService;
