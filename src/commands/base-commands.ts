import { Message, User } from "discord.js";
import { IGuild } from "../models/Guild";
import { IPlayer } from '../models/Player';

export default abstract class BaseCommands {
    protected user: User;

    constructor(protected message: Message, protected guild: IGuild, protected player: IPlayer) {
        this.user = message.author;
    }
}
