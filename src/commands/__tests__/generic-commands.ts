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
                level: 1,
                maxLevel: 2,
            });

            const message = new MessageFactory('-rebirth')
                .withPlayer(player)
                .make();

            await runApplication(message);

            expect(message.send).toBeCalledWith(expect.objectContaining({
                description: expect.stringContaining('You must be level 2 in order to rebirth.'),
            }));
        });

        test('Can rebirth if you are at max level', async () => {
            const player = await factory(Player).create({
                level: 2,
                maxLevel: 2,
            });

            const message = new MessageFactory('-rebirth')
                .withPlayer(player)
                .make();

            await runApplication(message);

            expect(message.send).toBeCalledWith(expect.objectContaining({
                description: expect.stringContaining(`Congratulations ${player.username}! You've rebirthed! Your new max level is ${player.maxLevel}`),
            }));

            expect(player.maxLevel).toBe(12);
        });
    });
});