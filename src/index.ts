import dotenv from 'dotenv';
dotenv.config();

import { connect } from 'mongoose';
import AdventureConfig from './config/adventure';
import Application from './application';
import { Discord } from './discord/discord';
import { Message as DiscordMessage } from 'discord.js';
import { Message } from './discord/message';

(async () => {
    await connect(AdventureConfig.mongodb.url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: AdventureConfig.mongodb.useCreateIndex,
        autoIndex: AdventureConfig.mongodb.autoIndex,
    });

    const discord = new Discord();

    await discord.login(async (discordMessage: DiscordMessage) => {
        const application = new Application;
        const message = new Message(discordMessage);

        await application.handleMessage(message);
    });
})();
