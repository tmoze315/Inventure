import { max } from 'date-fns';
import { enemies, IEnemy } from '../data/enemies';
import { AdventureResult, IAdventureResult } from '../models/AdventureResult';

interface StatRange {
    statType: string,
    min: number,
    max: number,
    winPercentage: number,
};

class EnemyService {
    /**
     * This needs to be a little intelligent. Our list of enemies is going to contain both weak and strong enemies.
     * We don't want enemies that are too strong being selected. So we need to work out a sensible range
     * that means players stand some chance of beating it.
     */
    static async getRandomEnemy(): Promise<IEnemy> {
        const statRange: StatRange = await EnemyService.getAppropriateStatRange();

        let enemyPool: Array<IEnemy> = [];

        enemies.forEach((enemy: IEnemy) => {
            const isWithinSuitableRange = enemy.baseHp >= (statRange.min * 0.75) && enemy.baseHp <= (statRange.max * 1.2);

            if (!isWithinSuitableRange) {
                return;
            }

            if ('boss' === enemy.type) {
                enemyPool.push(enemy);

                return;
            }

            // Make enemies spawn 15x more often than bosses
            for (let index = 0; index < 15; index++) {
                enemyPool.push(enemy);
            }
        });

        const randomNumber = Math.floor(Math.random() * enemyPool.length);

        if (enemyPool.length === 0) {
            enemyPool = enemies;
        }

        const enemy = enemyPool[randomNumber];

        const newEnemy = EnemyService.scaleStatsBasedOnWinPercentage(enemy, statRange.winPercentage);

        console.log(newEnemy);

        return newEnemy;
    }

    static scaleStatsBasedOnWinPercentage(enemy: IEnemy, winPercentage: number): IEnemy {
        let minHp = enemy.baseHp;
        let maxHp = enemy.baseHp;

        if (winPercentage >= 0.9) {
            minHp *= 2;
            maxHp *= 3;
        } else if (winPercentage >= 0.75) {
            minHp *= 1.5;
            maxHp *= 2;
        } else if (winPercentage >= 0.5) {
            minHp *= 1;
            maxHp *= 1.4;
        } else if (winPercentage >= 0.35) {
            minHp *= 0.8;
            maxHp *= 1;
        } else if (winPercentage >= 0.15) {
            minHp *= 0.7;
            maxHp *= 0.8;
        } else {
            minHp *= 0.6;
            maxHp *= 0.7;
        }

        let newHp = EnemyService.getRandomNumberBetween(minHp, maxHp);;

        if (minHp > maxHp) {
            newHp = EnemyService.getRandomNumberBetween(maxHp, minHp);
        }

        enemy.baseHp = newHp;

        return enemy;
    }

    private static getRandomNumberBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static async getAppropriateStatRange(): Promise<StatRange> {
        const results = await AdventureResult.find({}).limit(20).exec();

        if (!results || results.length === 0) {
            return <StatRange>{
                statType: 'hp',
                min: 0,
                max: 0,
                winPercentage: 0,
            };
        }

        const damagePerResult = results.map((result: IAdventureResult) => {
            let damage = result.get('damage');

            // Buff damage for solo players, so that they can't just solo this game
            // Eventually enemies will get too difficult for them
            if (1 === result.totalParticipants) {
                damage *= 1.25;
            }

            return damage;
        });

        const medianDamage = EnemyService.median(damagePerResult);

        const totalWins = results.filter((result: IAdventureResult) => {
            return result.wasSuccessful;
        }).length;

        const winPercentage = totalWins / results.length;

        const statRange = <StatRange>{
            statType: 'hp',
            min: medianDamage * 0.75,
            max: medianDamage * 1.95,
            winPercentage,
        };

        // Make enemies easier if players are on not doing so well
        if (winPercentage < 0.6) {
            statRange.min = medianDamage * winPercentage;
            statRange.max = medianDamage * 1.4;
        }

        console.log(statRange);

        return statRange;
    }

    /**
     * The "median" is the "middle" value in the list of numbers.
     *
     * @param {Array} numbers An array of numbers.
     * @return {Number} The calculated median value from the specified numbers.
     */
    private static median(numbers: Array<number>) {
        // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
        var median = 0, numsLen = numbers.length;
        numbers.sort();

        if (
            numsLen % 2 === 0 // is even
        ) {
            // average of two middle numbers
            median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
        } else { // is odd
            // middle number only
            median = numbers[(numsLen - 1) / 2];
        }

        return median;
    }
}

export default EnemyService;
