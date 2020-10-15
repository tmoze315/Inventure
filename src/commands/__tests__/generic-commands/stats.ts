import { factory, MessageFactory } from '../../../discord/__helpers__/jest.factories';
import { runApplication } from '../../../discord/__helpers__/jest.helpers';
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
});
