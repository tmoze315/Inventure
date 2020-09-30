import { Message, User, CollectorFilter } from "discord.js";
import { IGuild } from "../models/Guild";
import { IPlayer } from '../models/Player';

export default abstract class BaseCommands {
    protected user: User;

    constructor(protected message: Message, protected guild: IGuild, protected player: IPlayer) {
        this.user = message.author;
    }

    countdownSeconds(seconds: number, updateCallback: CallableFunction, endCallback: CallableFunction) {
        const tick = () => {
            seconds--;

            if (seconds % 5 === 0) {
                const remainingTime = `${seconds}s`;

                let color = 'GREEN';

                if (seconds <= 0 && seconds > 30 && seconds < 45) {
                    color = 'ORANGE';
                } else if (seconds <= 0 && seconds <= 30) {
                    color = 'RED';
                }

                updateCallback(remainingTime, color);
            }

            if (seconds > 0) {
                setTimeout(tick, 1000);
            } else {
                return endCallback();
            }
        }

        tick();
    }

    // https://gist.github.com/adhithyan15/4350689
    countdownMinutes(minutes: number, updateCallback: CallableFunction, endCallback: CallableFunction) {
        let seconds: number = 60;
        let mins: number = minutes;

        const tick = () => {
            let currentMinutes = mins - 1

            seconds--;

            if (seconds % 5 === 0) {
                const remainingTime = `${currentMinutes.toString()}m ${(seconds < 10 ? 0 : '')}${seconds}s`;
                let color = 'GREEN';

                if (currentMinutes <= 0 && seconds > 30 && seconds < 60) {
                    color = 'ORANGE';
                } else if (currentMinutes <= 0 && seconds <= 30) {
                    color = 'RED';
                }

                updateCallback(remainingTime, color);
            }

            if (seconds > 0) {
                setTimeout(tick, 1000);
            } else if (minutes > 1) {
                this.countdownMinutes(mins - 1, updateCallback, endCallback);
            } else if (currentMinutes <= 0 && seconds <= 0) {
                return endCallback();
            }
        }

        tick();
    }
}
