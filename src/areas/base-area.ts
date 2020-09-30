import { IEnemy } from "../interfaces/enemy";

interface IArea {
    getRandomEnemy(): IEnemy;

    key: string;
    name: string;
    description: string;
    color: string;
    miniBossColor: string;
    bossColor: string;
    travelCost: number;
}

/**
 * TODO LIST:
 * 1) Add the battle messages to here, so we can output phrases like:
 * "The path ahead winds down into a valley below" to the battle message and have them
 * make sense for your current area
 * 2) Add quest items needed to unlock the boss
 */
abstract class BaseArea implements IArea {
    public abstract key: string;
    public abstract name: string;
    public abstract description: string;
    public abstract color: string;
    public abstract miniBossColor: string;
    public abstract bossColor: string;
    public abstract travelCost: number;

    protected abstract miniBossSpawnsOneIn: number;
    protected abstract getEnemyPool(): Array<IEnemy>;

    getRandomEnemy(): IEnemy {
        const fullEnemyPool: Array<IEnemy> = this.getEnemyPool();
        const enemyPool: Array<IEnemy> = [];

        // Do not spawn bosses
        fullEnemyPool.forEach((enemy) => {
            if (enemy.type === 'boss') {
                return;
            }

            if (enemy.type === 'mini-boss') {
                enemyPool.push(enemy);
                return;
            }

            // Make enemies spawn x times more often than mini-bosses
            for (let index = 0; index < this.miniBossSpawnsOneIn; index++) {
                enemyPool.push(enemy);
            }
        });

        const randomNumber = Math.floor(Math.random() * enemyPool.length);

        return enemyPool[randomNumber];
    }
}

export { BaseArea, IArea };