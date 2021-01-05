import { factory, MessageFactory } from '../../../discord/__helpers__/jest.factories';
import { runApplication } from '../../../__helpers__/jest.helpers';
import { Guild } from '../../../models/Guild';
import { Player } from '../../../models/Player';

describe('-rebirth', () => {
    test('Cannot rebirth if you are not at max level', async () => {
        const player = await factory(Player).create({
            level: 99,
            maxLevel: 100,
            rebirths: 9,
        });

        const message = new MessageFactory('-rebirth')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('You must be level 100 in order to rebirth.'),
        }));

        expect(player.level).toBe(99);
        expect(player.maxLevel).toBe(100);
        expect(player.rebirths).toBe(9);
    });

    test('Cannot rebirth when adventuring', async () => {
        const player = await factory(Player).create({
            level: 100,
            maxLevel: 100,
            rebirths: 9,
        });

        const guild = await factory(Guild).create({ isLocked: true });

        const message = new MessageFactory('-rebirth')
            .fromGuild(guild)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('You cannot rebirth right now. Your attention is needed elsewhere.'),
        }));

        expect(player.level).toBe(100);
        expect(player.maxLevel).toBe(100);
        expect(player.rebirths).toBe(9);
    });

    test('Can rebirth if you are at max level', async () => {
        const player = await factory(Player).create({
            level: 100,
            maxLevel: 100,
            rebirths: 9,
        });

        const message = new MessageFactory('-rebirth')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining(`Congratulations ${player.username}! You've rebirthed! Your new max level is ${player.maxLevel}`),
        }));

        expect(player.get('skillpoints.attack')).toBe(0);
        expect(player.get('skillpoints.charisma')).toBe(0);
        expect(player.get('skillpoints.intelligence')).toBe(0);

        const skillpoints = Math.ceil(Math.pow(10, 1.8));
        expect(player.get('skillpoints.unspent')).toBe(skillpoints);

        expect(player.get('stats.attack')).toBe(1);
        expect(player.get('stats.charisma')).toBe(1);
        expect(player.get('stats.intelligence')).toBe(1);
        expect(player.get('stats.luck')).toBe(1);
        expect(player.get('stats.dexterity')).toBe(1);

        expect(player.rebirths).toBe(10);
        expect(player.maxLevel).toBe(110);

        expect(player.level).toBe(1);
        expect(player.experience).toBe(1);
    });
});