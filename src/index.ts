import dotenv from 'dotenv';
dotenv.config();

import { Message, Client } from 'discord.js';
import { connect } from 'mongoose';
import PlayerService from './services/PlayerService';
import availableCommands from './config/available-commands';

(async () => {
    await connect('mongodb://127.0.0.1:27017/inventure', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    // Create an instance of a Discord client
    const client = new Client();

    client.on('ready', () => {
        console.log('Bot successfully loaded.');
    });

    // Create an event listener for messages
    client.on('message', async (message: Message) => {
        const prefix = '-';

        if (!message.content.startsWith(prefix) || message.author.bot) {
            return;
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args?.shift()?.toLowerCase();

        if (!command) {
            return;
        }

        if ('start' !== command) {
            const player = await PlayerService.getCurrentPlayer(message.author);

            if (!player) {
                message.channel.send(`Oops, it looks like you haven't started your journey yet. Create your character with \`${prefix}start\``);

                return;
            }
        }

        console.log(availableCommands);
        // Check if command is in config. Call it        
        // const adventure = new AvailableCommands(message);

        // if ('function' === typeof (adventure as any)[command]) {
        //     (adventure as any)[command](args);
        // } else {
        //     message.channel.send(`Unable to find command '${command}'`);
        // }
    });

    // Log our bot in using the token from https://discord.com/developers/applications
    client.login(process.env.DISCORD_KEY);
})();