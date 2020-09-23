import { User } from "discord.js";
import { Player } from "../models/Player";

class PlayerService {
    static async getCurrentPlayer(user: User) {
        return await Player.findOne({ id: user.id }).exec();
    }
}

export default PlayerService;
