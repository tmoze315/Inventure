import dotenv from 'dotenv';
dotenv.config();

import { Message, Client, Guild } from 'discord.js';
import { connect } from 'mongoose';
import PlayerService from './services/PlayerService';
import availableCommands from './config/available-commands';
import { Guild as GuildModel } from './models/Guild';
import { IPlayer } from './models/Player';
import AdventureConfig from './config/adventure';

(async () => {
    await connect('mongodb://127.0.0.1:27017/inventure', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    // Create an instance of a Discord client
    const client = new Client();

    client.on('ready', () => {
        console.log('Bot successfully loaded.');
    });

    // Create an event listener for messages
    client.on('message', async (message: Message) => {
        const prefix = AdventureConfig.prefix;

        if (!message.content.startsWith(prefix) || message.author.bot) {
            return;
        }

        let guild: Guild | null = message.guild;

        if (!guild) {
            return;
        }

        let existingGuild = await GuildModel.findOne({ id: guild.id }).exec();

        if (!existingGuild) {
            const newGuild = new GuildModel({
                id: guild.id,
                lastAdventure: null,
            });

            existingGuild = await newGuild.save();
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args?.shift()?.toLowerCase();

        if (!command) {
            return;
        }

        const player: IPlayer | null = await PlayerService.getCurrentPlayer(message.author);

        if ('start' !== command && !player) {
            message.channel.send(`Oops, it looks like you haven't started your journey yet. Create your character with \`${prefix}start\``);

            return;
        }

        if (player?.hasBeenBanned()) {
            message.channel.send(`Oops, it looks like you're banned. If you believe this is a mistake, please speak with an administrator.`);
            return;
        }

        // Fine the matching "route" (aka which commands file and method to call)
        const route = (availableCommands as any)[command];

        // We don't support the given command
        if (!route) {
            return;
        }

        // Create the controller, so we have a reference to the message available at all times
        const commandInstance = new route.class(message, existingGuild);

        commandInstance[route.method](...args);
    });
    
    // Log our bot in using the token from https://discord.com/developers/applications
    client.login(AdventureConfig.discordKey);

})();
