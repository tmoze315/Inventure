import { registry } from '@alexlafroscia/service-locator';
import subSeconds from 'date-fns/subSeconds';
import { factory, MessageFactory } from '../../../discord/__helpers__/jest.factories';
import { mockSetTimeout, mockTime, runApplication } from '../../../__helpers__/jest.helpers';
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

    // test('Starting an adventure spawns a monster', async () => {
    test('Cannot start an adventure if you are not in an area', async () => {
        const AreaService: any = registry.lookup('AreaService');

        AreaService.findArea = (areaName: string) => {
            return null;
        };

        registry.register('AreaService', AreaService);

        const time = new Date('2020-10-10 10:10:10');
        mockTime(time);

        let setTimeoutCalls = 0;

        mockSetTimeout((callback: CallableFunction, time: number) => {
            setTimeoutCalls++;
            console.log(`setTimeoutCalls: ${setTimeoutCalls}`);

            callback();
        });

        const player = await factory(Player).create();
        const guild = await factory(Guild).create();

        const message = new MessageFactory('-adventure')
            .fromGuild(guild)
            .fromPlayer(player)
            .make();

        await runApplication(message);

        expect(message.send).toBeCalledWith(
            expect.objectContaining({
                description: expect.stringContaining('Oops, it doesn\'t look like you are in an area. Travel somewhere with the `-area` command'),
            })
        );
    });

    // test('Starting an adventure starts a lock', async () => {
    //     const player = await factory(Player).create();
    //     const guild = await factory(Guild).create();

    //     mockSetTimeout((callback: CallableFunction, time: number) => callback());

    //     const messageA = new MessageFactory('-adventure')
    //         .fromGuild(guild)
    //         .fromPlayer(player)
    //         .make();

    //     await runApplication(messageA);

    //     const messageB = new MessageFactory('-adventure')
    //         .fromGuild(guild)
    //         .fromPlayer(player)
    //         .make();

    //     await runApplication(messageB);

    //     expect(messageB.send).toBeCalledWith(
    //         expect.objectContaining({
    //             description: expect.stringContaining(`You are currently too preocupied to do this`),
    //         })
    //     );
    // });

    test('Cannot start adventure until cooldown is over', async () => {
        const config: IAdventureConfig = registry.lookup('AdventureConfig');

        config.adventureCooldownInSeconds = 10;

        registry.register('AdventureConfig', config);

        const time = new Date('2020-10-10 10:10:10');

        mockTime(time);

        mockSetTimeout((callback: CallableFunction, time: number) => {
            expect(time).toBe(8000); // 8 seconds (10s - 2s)

            callback();
        });

        const player = await factory(Player).create();
        const guild = await factory(Guild).create({
            lastAdventure: subSeconds(time, 2),
        });

        const message = new MessageFactory('-adventure')
            .fromGuild(guild)
            .fromPlayer(player)
            .make();

        const messageB = new MessageFactory().make();

        message.setNextSendMessage(messageB);

        await runApplication(message);

        expect(message.send).toBeCalledWith(
            expect.objectContaining({
                description: expect.stringContaining(`No heroes are ready to depart in an adventure. Try again in less than 10 seconds.`),
            })
        );

        expect(messageB.edit).toBeCalledWith(
            expect.objectContaining({
                description: expect.stringContaining(`Adventurers are now ready to depart!`),
            })
        );
    });
});