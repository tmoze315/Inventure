import { runApplication, createMessage } from '../../discord/__helpers__/jest.helpers';
import { Player } from '../../models/Player';

describe('Generic Commands', () => {
    // describe('-stats', () => {
    // });

    describe('-start', () => {
        test('Can start an adventure', async () => {
            const message = createMessage('-start');
            await runApplication(message);

            expect(message.send).toBeCalledWith(
                expect.objectContaining({
                    description: expect.stringContaining('Welcome to Inventure, testing-user'),
                })
            );
        });

        test('Cannot start an adventure again', async () => {
            const player = new Player({
                id: 123,
                username: 'testing-player',
            });

            await player.save();

            const message = createMessage('-start');

            message._player = player;

            await runApplication(message);

            expect(message.send).toBeCalledWith('Looks like you have already started your adventure!');
        });
    });
});