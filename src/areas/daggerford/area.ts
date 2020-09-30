import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';
import colors from '../../config/colors';

class DaggerfordArea extends BaseArea {
    public key: string = 'daggerford';
    public name: string = 'Daggerford';
    public description: string = 'Forest City';
    public color: string = colors['teal-400'];
    public miniBossColor: string = colors['teal-600'];
    public bossColor: string = colors['teal-800'];
    public travelCost: number = 1000;
    public emoji: string = '🏡';

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { DaggerfordArea };