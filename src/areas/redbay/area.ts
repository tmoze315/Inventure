import colors from "../../config/colors";
import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';

class RedbayArea extends BaseArea {
    public key: string = 'redbay';
    public name: string = 'Redbay';
    public description: string = 'Port country';
    public color: string = colors['teal-500'];
    public miniBossColor: string = colors['teal-700'];
    public bossColor: string = colors['teal-900'];
    public travelCost: number = 2000;
    public emoji: string = '⚓️';

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { RedbayArea };