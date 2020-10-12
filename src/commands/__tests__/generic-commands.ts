import { Message } from 'discord.js';
import { Client } from 'discord.js';
import { MockGuild, MockMessage, MockTextChannel, MockUser } from "jest-discordjs-mocks";
import Application from '../../application';
import { MongoMemoryServer } from 'mongodb-memory-server';
import AdventureConfig from '../../config/adventure';
import { connect, disconnect } from 'mongoose';

describe('auth', () => {
    it('should resolve with true and valid userId for hardcoded token', async (done) => {
        const mongoServer = new MongoMemoryServer();
        const url = await mongoServer.getUri();

        await connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: AdventureConfig.mongodb.useCreateIndex,
            autoIndex: AdventureConfig.mongodb.autoIndex,
        });

        const application = new Application;

        // client.on('ready', () => {
        //     console.log('HERE');

        //     expect(true).toBe(true);
        //     done();
        // });
        // const guild = new MockGuild();
        // const message = new MockMessage;
        // const user = new MockUser(null, {
        //     id: 1,
        // });

        // message.content = '-stats';
        // message.channel = new MockTextChannel(guild, {});
        // message.author = user;

        // jest.spyOn(message.channel, 'send').mockImplementation((): Promise<Message[]> => {
        //     return Promise.resolve().then(() => {
        //         return [message];
        //     });
        // });

        // await application.handleMessage(message);

        // expect(message.channel.send).toBeCalledWith('Oops, it looks like you haven\'t started your journey yet. Create your character with `-start`');

        await disconnect();
        await mongoServer.stop();

        done();
    })
});