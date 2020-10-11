import { IBoss, IEnemy } from "../interfaces/enemy";

interface IArea {
    getRandomEnemy(): IEnemy;
    getBoss(): IBoss;

    key: string;
    name: string;
    description: string;
    color: string;
    miniBossColor: string;
    bossColor: string;
    travelCost: number;
    emoji: string;
    questItem: string;
    totalQuestItemsNeeded: number;
    xpMultiplier: number;
    goldMultiplier: number;
    normalChestDropRate: number;
    rareChestDropRate: number;
    epicChestDropRate: number;
    legendaryChestDropRate: number;
    ascendedChestDropRate: number;
    setChestDropRate: number;
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

    public emoji: string = '🗺';
    public questItem: string = '🗝';
    public totalQuestItemsNeeded: number = 5;
    public xpMultiplier: number = 1.0;
    public goldMultiplier: number = 1.0;
    public normalChestDropRate: number = 0.5;
    public rareChestDropRate: number = 0.4;
    public epicChestDropRate: number = 0.3;
    public legendaryChestDropRate: number = 0.2;
    public ascendedChestDropRate: number = 0.1;
    public setChestDropRate: number = 0.05;

    protected abstract miniBossSpawnsOneIn: number;
    protected abstract getEnemyPool(): Array<IEnemy>;

    public abstract getBoss(): IBoss;

    getRandomEnemy(): IEnemy {
        const fullEnemyPool: Array<IEnemy> = this.getEnemyPool();
        const enemyPool: Array<IEnemy> = [];

        // Do not spawn bosses
        fullEnemyPool.forEach((enemy) => {
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