import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';
import colors from '../../config/colors';

class KingdomOfMinasArea extends BaseArea {
    public key: string = 'kingdom-of-minas';
    public name: string = 'Kingdom of Minas';
    public description: string = 'Beautiful Kingdom of Saints';
    public color: string = colors['pink-700'];
    public miniBossColor: string = colors['pink-800'];
    public bossColor: string = colors['pink-900'];
    public travelCost: number = 10000;
    public emoji: string = '🏛';

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { KingdomOfMinasArea };