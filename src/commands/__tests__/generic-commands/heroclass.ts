import { factory, MessageFactory } from '../../../discord/__helpers__/jest.factories';
import { runApplication } from '../../../discord/__helpers__/jest.helpers';
import { Player } from '../../../models/Player';
import { Guild } from '../../../models/Guild';
import 'jest-extended';

describe('-heroclass', () => {
    test('Cannot select hero class when adventuring', async () => {
        const player = await factory(Player).create({
            class: 'Berserker',
        });

        const guild = await factory(Guild).create({ isLocked: true });

        const message = new MessageFactory('-heroclass wizard')
            .fromGuild(guild)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('You cannot select a hero class right now. Your attention is needed elsewhere.'),
        }));

        expect(player.class).toBe('Berserker');
    });

    test('Cannot select an invalid hero class', async () => {
        const player = await factory(Player).create({
            level: 10,
            class: 'Berserker',
        });

        const message = new MessageFactory('-heroclass nope')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, that class cannot be found.'),
        }));

        expect(player.class).toBe('Berserker');
    });

    test('Cannot select a hero class when below level 10', async () => {
        const player = await factory(Player).create({
            level: 9,
            rebirths: 1,
            class: null,
        });

        const message = new MessageFactory('-heroclass wizard')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('testing-player, you must be atleast level 10 to select a class.'),
        }));

        expect(player.class).toBeNull();
    });

    test('Cannot select a hero class if you do not have enough currency', async () => {
        const player = await factory(Player).create({
            currency: 14999,
            level: 10,
            rebirths: 1,
            class: null,
        });

        const message = new MessageFactory('-heroclass wizard')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining(`testing-player, you need 15,000 gold to select a class.`),
        }));

        expect(player.class).toBeNull();
    });

    test.each([
        ['berserker', 'Berserker'],
        ['tinkerer', 'Tinkerer'],
        ['wizard', 'Wizard'],
        ['cleric', 'Cleric'],
        ['ranger', 'Ranger'],
    ])('Can select a hero class at level 10', async (className, expected) => {
        const player = await factory(Player).create({
            currency: 16000,
            level: 10,
            rebirths: 1,
            class: null,
        });

        const message = new MessageFactory(`-heroclass ${className}`)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining(`Congratulations testing-player, you are now a ${expected}.`),
        }));

        expect(player.class).toBe(expected);
        expect(player.currency).toBe(1000);
    });

    test('Cost increases with rebirths (15,000 x rebirths)', async () => {
        const player = await factory(Player).create({
            currency: 100000,
            level: 10,
            rebirths: 5,
        });

        const message = new MessageFactory(`-heroclass wizard`)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining(`Congratulations testing-player, you are now a Wizard.`),
        }));

        expect(player.class).toBe('Wizard');
        expect(player.currency).toBe(25000);
    });

    test('Can view help message', async () => {
        const player = await factory(Player).create({
            class: 'Wizard',
        });

        const message = new MessageFactory('-heroclass')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.toIncludeMultiple([
                `So you think you're read to choose a class testing-player?`,
                `Syntax: -heroclass <name>`,
                `**Berserker**\n_Berserkers have the option to rage and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure._\n`,
                `**Wizard** [Current class]\n_Wizards have the option to focus and add large bonuses to their magic, but their focus can sometimes go astray...\nUse the focus command when attacking in an adventure._\n`,
                `**Ranger**\n_Rangers can gain a special pet, which can find items and give reward bonuses.\nUse the pet command to see pet options._\n`,
                `**Tinkerer**\n_Tinkerers can forge two different items into a device bound to their very soul.\nUse the forge command._\n`,
                `**Cleric**\n_Clerics can bless the entire group when praying.\nUse the bless command when fighting in an adventure._\n`,
            ]),
        }));

        expect(player.class).toBe('Wizard');
    });
});
