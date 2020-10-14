import { factory, MessageFactory } from '../../discord/__helpers__/jest.factories';
import { runApplication } from '../../discord/__helpers__/jest.helpers';
import { Player } from '../../models/Player';

describe('Generic', () => {
    describe('-start', () => {
        test('Can start an adventure', async () => {
            const message = new MessageFactory('-start').make();
            await runApplication(message);

            expect(message.send).toBeCalledWith(
                expect.objectContaining({
                    description: expect.stringContaining('Welcome to Inventure, testing-user'),
                })
            );
        });

        test('Cannot start an adventure again', async () => {
            const player = await factory(Player).create();

            const message = new MessageFactory('-start')
                .withPlayer(player)
                .make();

            await runApplication(message);

            expect(message.send).toBeCalledWith('Looks like you have already started your adventure!');
        });
    });

    describe('-rebirth', () => {
        test('Cannot rebirth if you are not at max level', async () => {
            const player = await factory(Player).create({
                level: 99,
                maxLevel: 100,
                rebirths: 9,
            });

            const message = new MessageFactory('-rebirth')
                .withPlayer(player)
                .make();

            await runApplication(message);

            expect(message.send).toBeCalledWith(expect.objectContaining({
                description: expect.stringContaining('You must be level 100 in order to rebirth.'),
            }));

            expect(player.level).toBe(99);
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
                .withPlayer(player)
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

    describe('-skill', () => {
        test('Can view command help', async () => {
            const player = await factory(Player).create({
                skillpoints: {
                    attack: 1,
                    unspent: 2,
                },
            });

            const message = new MessageFactory('-skill')
                .withPlayer(player)
                .make();

            await runApplication(message);

            expect(player.get('skillpoints.attack')).toBe(1);
            expect(player.get('skillpoints.unspent')).toBe(2);

            expect(message.send).toBeCalledWith(expect.objectContaining({
                description: expect.stringContaining('You must include the desired skill using -skill [skill name]!'),
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
                .withPlayer(player)
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
                .withPlayer(player)
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
                .withPlayer(player)
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
                .withPlayer(player)
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
                .withPlayer(player)
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
                .withPlayer(player)
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
                .withPlayer(player)
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
            ['int', 'intelligence'],
            ['intel', 'intelligence'],
            ['cha', 'charisma'],
            ['char', 'charisma'],
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
                .withPlayer(player)
                .make();

            await runApplication(message);

            expect(player.get(`skillpoints.${skill}`)).toBe(2);
            expect(player.get('skillpoints.unspent')).toBe(0);

            expect(message.send).toBeCalledWith(expect.objectContaining({
                description: expect.stringContaining(`testing-player, you have increased your ${skill} by 1.`),
            }));
        });
    });
});