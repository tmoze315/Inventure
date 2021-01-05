import dotenv from 'dotenv';
import _ from 'lodash';

dotenv.config();

import { connect } from 'mongoose';
import { AdventureConfig } from './config/adventure';
import Application from './application';
import { Discord } from './discord/discord';
import { Message as DiscordMessage } from 'discord.js';
import { Message } from './discord/message';
import { makeErrorMessage } from './messages/error';
import { registry } from '@alexlafroscia/service-locator';

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

        registry.register('message', message);
        registry.register('AdventureConfig', AdventureConfig);

        try {
            await application.handleMessage();
        } catch (error) {
            console.error(error);

            message.send(makeErrorMessage('Oops, it looks like something went wrong. Please try again. If the problem persists, get in touch with an admin.'));
        }
    });
})();
