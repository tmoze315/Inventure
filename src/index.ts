'use strict';

import { Message, Client } from 'discord.js';
import { AvailableCommands } from './core/available-commands';

// Create an instance of a Discord client
const client = new Client();

client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', (message: Message) => {
    const prefix = '-';

    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args?.shift()?.toLowerCase();

    if (!command) {
        return;
    }

    const adventure = new AvailableCommands(message);

    if (typeof (adventure as any)[command] === 'function') {
        (adventure as any)[command](args);
    } else {
        message.channel.send(`Unable to find command '${command}'`);
    }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('NzU4MDQzMTM3Mjg4NTY4ODMz.X2pMrw.FKfMmyLmXo1UWkiZgpHLFV-uTLw');
