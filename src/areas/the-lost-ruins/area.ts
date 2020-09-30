import colors from "../../config/colors";
import { IBoss, IEnemy } from "../../interfaces/enemy";
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

export { TheLostRuinsArea };