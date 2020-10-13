import { runApplication, createMessage } from '../discord/__helpers__/jest.helpers';
import { Guild } from '../models/Guild';
import { Player } from '../models/Player';

describe('Application', () => {
    test('Cannot use bot before starting adventure', async () => {
        const message = createMessage('-stats');
        await runApplication(message);

        expect(message.send).toBeCalledWith('Oops, it looks like you haven\'t started your journey yet. Create your character with `-start`');
    });

    test('Guild is created if one does not exist', async () => {
        const message = createMessage('-stats');

        let guilds = await Guild.find().exec();
        expect(guilds.length).toBe(0);

        await runApplication(message);

        guilds = await Guild.find().exec();
        expect(guilds.length).toBe(1);
    });

    test('Guild is not created if one does already exists', async () => {
        const message = createMessage('-stats');

        const guild = new Guild({ id: '123' });
        await guild.save();

        message._guild = guild;

        await runApplication(message);

        const guilds = await Guild.find().exec();

        expect(guilds.length).toBe(1);
        expect(guilds[0]).toMatchObject({ id: '123' });
    });

    test('Ignores messages from bots', async () => {
        const message = createMessage('-stats');

        message._isFromBot = true;

        await runApplication(message);

        expect(message.send).not.toBeCalled();

        const guilds = await Guild.find().exec();
        expect(guilds.length).toBe(0);
    });

    test('Ignores messages without prefix', async () => {
        const message = createMessage('stats');

        await runApplication(message);

        expect(message.send).not.toBeCalled();

        const guilds = await Guild.find().exec();
        expect(guilds.length).toBe(0);
    });

    test('Ignores empty commands', async () => {
        const message = createMessage('-');

        await runApplication(message);

        expect(message.send).not.toBeCalled();

        const guilds = await Guild.find().exec();
        expect(guilds.length).toBe(0);
    });

    test('Ignores unsupported commands', async () => {
        const message = createMessage('-abcdefg');

        const player = new Player({
            id: 123,
            username: 'testing-player',
        });

        await player.save();

        message._player = player;

        await runApplication(message);

        expect(message.send).not.toBeCalled();
    });

    test('Prevent banned users from running commands', async () => {
        const message = createMessage('-stats');

        const player = new Player({
            id: 123,
            username: 'testing-player',
            isBanned: true,
        });

        await player.save();

        message._player = player;

        await runApplication(message);

        expect(message.send.mock.calls.length).toBe(1);
        expect(message.send).toBeCalledWith('Oops, it looks like you\'re banned. If you believe this is a mistake, please speak with an administrator.');
    });
});
