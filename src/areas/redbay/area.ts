import colors from "../../config/colors";
import { IBoss, IEnemy } from "../../interfaces/enemy";
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

export { RedbayArea };