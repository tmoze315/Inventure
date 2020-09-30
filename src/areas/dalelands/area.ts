import { IEnemy } from "../../interfaces/enemy";
import { BaseArea } from "../base-area";
import enemies from './enemies';

class DalelandsArea extends BaseArea {
    public key: string = 'dalelands';
    public name: string = 'Dalelands';
    public description: string = 'Dense Forest Country';
    public color: string = '#0f0';
    public miniBossColor: string = '#00f';
    public bossColor: string = '#f00';
    public travelCost: number = 1000;

    protected miniBossSpawnsOneIn: number = 15;

    protected getEnemyPool(): Array<IEnemy> {
        return enemies;
    }
}

export { DalelandsArea };