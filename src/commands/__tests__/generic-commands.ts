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
            const player = factory(Player).make();

            const message = new MessageFactory('-start')
                .withPlayer(player)
                .make();

            await runApplication(message);

            expect(message.send).toBeCalledWith('Looks like you have already started your adventure!');
        });
    });

    describe('-rebirth', () => {
        test('Can start an adventure', async () => {
            const message = new MessageFactory('-start').make();

            await runApplication(message);

            expect(message.send).toBeCalledWith(
                expect.objectContaining({
                    description: expect.stringContaining('Welcome to Inventure, testing-user'),
                })
            );
        });
    });
});