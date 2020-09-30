import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';
import colors from '../../config/colors';

class DalelandsArea extends BaseArea {
    public key: string = 'dalelands';
    public name: string = 'Dalelands';
    public description: string = 'Dense Forest Country';
    public color: string = colors['green-500'];
    public miniBossColor: string = colors['green-700'];
    public bossColor: string = colors['green-900'];
    public travelCost: number = 1000;
    public emoji: string = '🌲';

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { DalelandsArea };