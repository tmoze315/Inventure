import { factory, MessageFactory } from '../../../discord/__helpers__/jest.factories';
import { runApplication } from '../../../__helpers__/jest.helpers';
import { Guild } from '../../../models/Guild';
import { Player } from '../../../models/Player';

describe('-skill', () => {
    test('Can view command help', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 2,
            },
        });

        const message = new MessageFactory('-skill')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(2);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('You must include the desired skill using -skill [skill name]!'),
        }));
    });

    test('Cannot use skillpoints when adventuring', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 1,
            },
        });

        const guild = await factory(Guild).create({ isLocked: true });

        const message = new MessageFactory('-skill attack')
            .fromGuild(guild)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(1);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('You cannot use your skillpoints right now. Your attention is needed elsewhere.'),
        }));
    });

    test('Cannot use skillpoint on an unsupported attribute', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 1,
            },
        });

        const message = new MessageFactory('-skill nope')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(1);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, that skill cannot be found'),
        }));
    });

    test('Cannot use a skillpoint if you have no available skill points', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 0,
            },
        });

        const message = new MessageFactory('-skill attack')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(0);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, you don\'t have enough skillpoints.'),
        }));
    });

    test('Cannot use multiple skillpoints if you have do not have enough available skill points', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 2,
            },
        });

        const message = new MessageFactory('-skill attack 3')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(2);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, you don\'t have enough skillpoints.'),
        }));
    });

    test('Cannot remove skillpoints using a negative value', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 2,
            },
        });

        const message = new MessageFactory('-skill attack -2')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(2);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, you must provide a valid skillpoint amount.'),
        }));
    });

    test('Must use an integer for the skillpoint amount', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 2,
            },
        });

        const message = new MessageFactory('-skill attack 0.5')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(2);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, you must provide a valid skillpoint amount.'),
        }));
    });

    test('Cannot use zero skillpoints', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 2,
            },
        });

        const message = new MessageFactory('-skill attack 0')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(2);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, you must provide a valid skillpoint amount.'),
        }));
    });

    test('Cannot use words for the skillpoint amount', async () => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                unspent: 2,
            },
        });

        const message = new MessageFactory('-skill attack nope')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get('skillpoints.attack')).toBe(1);
        expect(player.get('skillpoints.unspent')).toBe(2);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, you must provide a valid skillpoint amount.'),
        }));
    });

    test.each([
        ['attack'],
        ['intelligence'],
        ['charisma'],
    ])('Can use a skillpoint (%s)', async (skill) => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                charisma: 1,
                intelligence: 1,
                unspent: 2,
            },
        });

        const message = new MessageFactory(`-skill ${skill}`)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get(`skillpoints.${skill}`)).toBe(2);
        expect(player.get('skillpoints.unspent')).toBe(1);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining(`testing-player, you have increased your ${skill} by 1.`),
        }));
    });

    test.each([
        ['attack'],
        ['intelligence'],
        ['charisma'],
    ])('Can use multiple skillpoints at once (%s)', async (skill) => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                charisma: 1,
                intelligence: 1,
                unspent: 10,
            },
        });

        const message = new MessageFactory(`-skill ${skill} 10`)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get(`skillpoints.${skill}`)).toBe(11);
        expect(player.get('skillpoints.unspent')).toBe(0);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining(`testing-player, you have increased your ${skill} by 10.`),
        }));
    });

    test.each([
        ['att', 'attack'],
        ['Attack', 'attack'],
        ['int', 'intelligence'],
        ['intel', 'intelligence'],
        ['Intelligence', 'intelligence'],
        ['cha', 'charisma'],
        ['char', 'charisma'],
        ['Charisma', 'charisma'],
    ])('Can use shortened skillpoint name (%s)', async (shortSkillName, skill) => {
        const player = await factory(Player).create({
            skillpoints: {
                attack: 1,
                intelligence: 1,
                charisma: 1,
                unspent: 1,
            },
        });

        const message = new MessageFactory(`-skill ${shortSkillName}`)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(player.get(`skillpoints.${skill}`)).toBe(2);
        expect(player.get('skillpoints.unspent')).toBe(0);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining(`testing-player, you have increased your ${skill} by 1.`),
        }));
    });
});