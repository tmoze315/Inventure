import { registry } from '@alexlafroscia/service-locator';
import subSeconds from 'date-fns/subSeconds';
import { factory, MessageFactory } from '../../../discord/__helpers__/jest.factories';
import { mockTime, runApplication } from '../../../__helpers__/jest.helpers';
import { Guild } from '../../../models/Guild';
import { Player } from '../../../models/Player';
import { IAdventureConfig } from '../../../config/adventure';

describe('-adventure', () => {
    test('Cannot start adventure if one is already in progress', async () => {
        const player = await factory(Player).create();
        const guild = await factory(Guild).create({ isLocked: true });

        const message = new MessageFactory('-adventure')
            .fromGuild(guild)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(
            expect.objectContaining({
                description: expect.stringContaining(`You are currently too preocupied to do this`),
            })
        );
    });

    test('Cannot start adventure until cooldown is over', async () => {
        const config: IAdventureConfig = registry.lookup('AdventureConfig');

        config.adventureCooldownInSeconds = 10;

        registry.register('AdventureConfig', config);

        const time = new Date('2020-10-10 10:10:10');

        mockTime(time);

        const player = await factory(Player).create();
        const guild = await factory(Guild).create({
            lastAdventure: subSeconds(time, 2),
        });

        const message = new MessageFactory('-adventure')
            .fromGuild(guild)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(
            expect.objectContaining({
                description: expect.stringContaining(`No heroes are ready to depart in an adventure. Try again in less than 10 seconds.`),
            })
        );
    });
});