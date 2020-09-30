import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';
import colors from '../../config/colors';

class TriggalaDivideArea extends BaseArea {
    public key: string = 'triggala-divide';
    public name: string = 'Triggala Divide';
    public description: string = 'A large area of land and water separating the world from the kingdom of minas';
    public color: string = colors['indigo-700'];
    public miniBossColor: string = colors['indigo-800'];
    public bossColor: string = colors['indigo-900'];
    public travelCost: number = 7000;
    public emoji: string = '🗾';

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { TriggalaDivideArea };