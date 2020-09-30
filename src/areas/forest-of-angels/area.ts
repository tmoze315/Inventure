import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';
import colors from '../../config/colors';

class ForestOfAngelsArea extends BaseArea {
    public key: string = 'forest-of-angels';
    public name: string = 'Forest of Angels';
    public description: string = 'Mysterious forest';
    public color: string = colors['purple-700'];
    public miniBossColor: string = colors['purple-800'];
    public bossColor: string = colors['purple-900'];
    public travelCost: number = 6000;
    public emoji: string = '🔮';

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { ForestOfAngelsArea };