import { factory, MessageFactory } from '../../../discord/__helpers__/jest.factories';
import { runApplication } from '../../../__helpers__/jest.helpers';
import { Player } from '../../../models/Player';
import 'jest-extended';

describe('-stats', () => {
    test('Can view basic player stats', async () => {
        const player = await factory(Player).create({
            level: 99,
            maxLevel: 100,
            rebirths: 9,
            stats: {
                attack: 2,
                charisma: 3,
                intelligence: 4,
                dexterity: 5,
                luck: 6,
            },
            skillpoints: {
                attack: 7,
                charisma: 8,
                intelligence: 9,
                unspent: 10,
            },
            currency: 1234,
            experience: 9654353,
        });

        const message = new MessageFactory('-stats')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            title: 'A level 99 Hero',
            description: expect.toIncludeMultiple([
                'All heroes are destined for greatness, your journey begins now.',
                'Select a hero class using the `-heroclass` command.',
                'Rebirths: 9',
                'Max-Level: 100',
                'Attack: 2 [+7]',
                'Charisma: 3 [+8]',
                'Intelligence: 4 [+9]',
                'Dexterity: 5',
                'Luck: 6',
                'Currency: 1,234',
                'Experience: 9,654,353/10,000,000',
                'Unspent Skillpoints: 10'
            ]),
        }));
    });

    test('Shows correct experience when at max level', async () => {
        const player = await factory(Player).create({
            level: 100,
            maxLevel: 100,
            experience: 10000000,
        });

        const message = new MessageFactory('-stats')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.toIncludeMultiple([
                'Max-Level: 100',
                'Experience: 10,000,000/10,000,000',
            ]),
            thumbnail: expect.objectContaining({
                url: 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/618476d18c95662c3352f18b5c3b5118/CLASSRogue.JPG',
            }),
        }));
    });

    test('Shows message about choosing a class at level 10', async () => {
        const player = await factory(Player).create({
            level: 1,
            maxLevel: 10,
        });

        const message = new MessageFactory('-stats')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('When you reach level 10 you can choose your path and select a class for your hero.'),
        }));
    });

    test.each([
        ['Berserker', 'Berserkers have the option to rage and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure.', 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/5cc20b78734ffe0d264885ada90cd961/CLASSBarbarian.JPG'],
        ['Wizard', 'Wizards have the option to focus and add large bonuses to their magic, but their focus can sometimes go astray...\nUse the focus command when attacking in an adventure.', 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/34b30b92157ecc2bf75af2bcf708ba5a/CLASSWizard.JPG'],
        ['Ranger', 'Rangers can gain a special pet, which can find items and give reward bonuses.\nUse the pet command to see pet options.', 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/2f0bc2ec03ff460ee815abe46b725347/CLASSRanger.JPG'],
        ['Tinkerer', 'Tinkerers can forge two different items into a device bound to their very soul.\nUse the forge command.', 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/b633bd0239f0ee1ef5f47272c7814c01/CLASSNecromancer.JPG'],
        ['Cleric', 'Clerics can bless the entire group when praying.\nUse the bless command when fighting in an adventure.', 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/56783c25637a39cb722076bec44bb29e/CLASSCleric.JPG'],
    ])('Shows hero class', async (className, description, imageUrl) => {
        const player = await factory(Player).create({
            class: className,
        });

        const message = new MessageFactory('-stats')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.toIncludeMultiple([
                description
            ]),
            thumbnail: expect.objectContaining({
                url: imageUrl,
            }),
        }));
    });

    test('Can view another player\'s stats', async () => {
        const playerA = await factory(Player).create({
            id: 1,
            username: 'player-a',
            level: 1,
            maxLevel: 10,
        });

        const playerB = await factory(Player).create({
            id: 12345,
            username: 'player-b',
            level: 99,
            maxLevel: 100,
            rebirths: 9,
            stats: {
                attack: 2,
                charisma: 3,
                intelligence: 4,
                dexterity: 5,
                luck: 6,
            },
            skillpoints: {
                attack: 7,
                charisma: 8,
                intelligence: 9,
                unspent: 10,
            },
            currency: 1234,
            experience: 9654353,
        });

        const message = new MessageFactory('-stats <@12345>')
            .fromPlayer(playerA)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            title: 'A level 99 Hero',
            description: expect.toIncludeMultiple([
                'Select a hero class using the `-heroclass` command.',
                'Rebirths: 9',
                'Max-Level: 100',
                'Attack: 2 [+7]',
                'Charisma: 3 [+8]',
                'Intelligence: 4 [+9]',
                'Dexterity: 5',
                'Luck: 6',
                'Currency: 1,234',
                'Experience: 9,654,353/10,000,000',
                'Unspent Skillpoints: 10'
            ]),
        }));
    });

    test('Can view another player\'s stats', async () => {
        const player = await factory(Player).create();

        const message = new MessageFactory('-stats nope')
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(expect.objectContaining({
            description: expect.stringContaining('Player not found. Please try again.'),
        }));
    });
});
