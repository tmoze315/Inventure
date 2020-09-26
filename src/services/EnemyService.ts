import { enemies, IEnemy } from '../data/enemies';

class EnemyService {
    static getRandomEnemy(): IEnemy {
        const randomNumber = Math.floor(Math.random() * enemies.length);
        console.log(randomNumber);

        return enemies[randomNumber];
    }
}

export default EnemyService;
