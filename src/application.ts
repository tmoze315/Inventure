import AdventureConfig from './config/adventure';
import availableCommands from './config/available-commands';
import { Guild } from './models/Guild';
import { IPlayer, Player } from './models/Player';
import { IMessage } from './discord/message';

class Application {
    async handleMessage(message: IMessage) {
        const prefix = AdventureConfig.prefix;

        if (!message.content().startsWith(prefix) || message.isFromBot()) {
            return;
        }

        const args = message.content().slice(prefix.length).trim().split(/ +/g);
        const command = args?.shift()?.toLowerCase()?.trim();

        if (!command) {
            return;
        }

        let guildId: string | null = message.guildId();
        let existingGuild = null;

        if (guildId) {
            existingGuild = await Guild.findOne({ id: guildId }).exec();
        }

        if (!existingGuild) {
            const newGuild = new Guild({
                id: guildId,
                lastAdventure: null,
            });

            existingGuild = await newGuild.save();
        }

        const player: IPlayer | null = await Player.findOne({ id: message.author().id }).exec();

        if ('start' !== command && !player) {
            return message.send(`Oops, it looks like you haven't started your journey yet. Create your character with \`${prefix}start\``);
        }

        if (player?.hasBeenBanned()) {
            return message.send(`Oops, it looks like you're banned. If you believe this is a mistake, please speak with an administrator.`);
        }

        // Fine the matching "route" (aka which commands file and method to call)
        const route = (availableCommands as any)[command];

        // We don't support the given command
        if (!route) {
            return;
        }

        // Create the controller, so we have a reference to the message available at all times
        const commandInstance = new route.class(message, existingGuild);

        return commandInstance[route.method](...args);
    }
}

export default Application;