import { IBoss, IEnemy } from "../../interfaces/enemy";
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

    public getBoss(): IBoss {
        return <IBoss>{
            name: 'Dracolich, The Undead Dragon',
            description: 'A dragon once feared by all over 300 years ago has been brought back to life by the Saints. You will want to close the distance fast, as his lightning breath is said to reach over 90 feet long. His skeletal body means he is has increased resistance to magic. ',
            baseHp: 3000,
            basePersuasionResistance: 3500,
            image: 'https://www.gamersdecide.com/sites/default/files/authors/u151777/dracolich.jpeg',
            battleDurationMinutes: 8,
        };
    }

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { DaggerfordArea };