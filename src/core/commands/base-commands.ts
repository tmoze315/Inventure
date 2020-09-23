import { Message, User } from "discord.js";

export default abstract class BaseCommands {
    protected user: User;

    constructor(protected message: Message) {
        this.user = message.author;
    }
}
