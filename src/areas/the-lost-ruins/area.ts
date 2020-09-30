import colors from "../../config/colors";
import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';

class TheLostRuinsArea extends BaseArea {
    public key: string = 'the-lost-ruins';
    public name: string = 'The Lost Ruins';
    public description: string = 'Desert';
    public color: string = colors['yellow-500'];
    public miniBossColor: string = colors['yellow-700'];
    public bossColor: string = colors['yellow-900'];
    public travelCost: number = 5000;
    public emoji: string = '🏜';

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { TheLostRuinsArea };