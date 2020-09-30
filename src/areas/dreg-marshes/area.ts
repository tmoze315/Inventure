import colors from "../../config/colors";
import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';

class DregMarshesArea extends BaseArea {
    public key: string = 'dreg-marshes';
    public name: string = 'Dreg Marshes';
    public description: string = 'Swamp area';
    public color: string = colors['orange-500'];
    public miniBossColor: string = colors['orange-700'];
    public bossColor: string = colors['orange-900'];
    public travelCost: number = 1500;
    public emoji: string = '🐊';

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { DregMarshesArea };