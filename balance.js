const beta = require('@stdlib/random/base/beta');
const basePdf = require('@stdlib/stats/base/dists/beta/pdf');
const Plot = require('@stdlib/plot/ctor');
const fs = require('fs');

function pdf(x, alpha, beta) {
    var alpha;
    var beta;
    var out;
    var x;
    var i;

    x = arguments[0];
    alpha = arguments[1];
    beta = arguments[2];
    out = new Array(x.length);

    // Evaluate the pdf for each value in `x`...
    for (i = 0; i < x.length; i++) {
        out[i] = basePdf(x[i], alpha, beta);
    }

    return out;
}

const areas = [
    'bayhill',
    'daggerford',
    'dreg-marshes',
    'forest-of-angels',
    'kingdom-of-minas',
    'redbay',
    'the-lost-ruins',
    'triggala-divide',
];

areas.forEach((area) => {
    let data = null;
    let enemies = null;

    try {
        data = require(`./src/areas/${area}/balancing.json`);
        enemies = require(`./dist/areas/${area}/enemies`).default;
    } catch(error) {
        console.warn("\x1b[2m", `Skipping ${area}`, "\x1b[0m");
    }

    if (!data || !enemies) {
        return;
    }
    
    console.log("\x1b[32m", `Balancing ${area} : ${enemies.length} enemies`, "\x1b[0m");
    
    const makeRandomNumber = beta.factory(data.alpha, data.beta, {
        'seed': data.seed,
    });
    
    let xAxisHp = [];
    let xAxisPersuasion = [];
    
    enemies = enemies.map((enemy) => {
        const hpScale = makeRandomNumber();
        const persuasionScale = makeRandomNumber();
    
        xAxisHp.push(hpScale);
        xAxisPersuasion.push(persuasionScale);
    
        let hp = Math.round(hpScale * data.maxHp);
        let persuasionResistance = Math.round(persuasionScale * data.maxPersuasionResistance);
    
        if (enemy.type === 'mini-boss') {
            hp *= 2;
            persuasionResistance *= 2;
        }
    
        enemy.baseHp = hp;
        enemy.basePersuasionResistance = persuasionResistance;
    
        return enemy;
    });
    
    xAxisHp = xAxisHp.sort();
    xAxisPersuasion = xAxisPersuasion.sort();
    
    const yAxisHp = pdf(xAxisHp, data.alpha, data.beta);
    const yAxisPersuasion = pdf(xAxisPersuasion, data.alpha, data.beta);
    
    const plotHp = new Plot({
        x: [xAxisHp],
        y: [yAxisHp],
    });
    
    const plotPersuasionResistance = new Plot({
        x: [xAxisPersuasion],
        y: [yAxisPersuasion],
    });
    
    const htmlHp = plotHp.render('html');
    const htmlPersuasionResistance = plotPersuasionResistance.render('html');
    
    fs.mkdir(`./balancing/areas/${area}/`, { recursive: true }, () => {
        fs.writeFile(`./balancing/areas/${area}/enemy-hp-bell-curve.html`, htmlHp, { encoding: 'utf8' }, () => { });
        fs.writeFile(`./balancing/areas/${area}/enemy-persuasion-resistance-bell-curve.html`, htmlPersuasionResistance, { encoding: 'utf8' }, () => { });
    
        let enemiesHtml = `const enemies = [`;
        enemies.forEach((enemy) => {
            enemiesHtml += `\n    <IEnemy>{`;
            enemiesHtml += `\n        name: '${enemy.name}',`;
            enemiesHtml += `\n        prefix: '${enemy.prefix}',`;
            enemiesHtml += `\n        baseHp: ${enemy.baseHp},`;
            enemiesHtml += `\n        basePersuasionResistance: ${enemy.basePersuasionResistance},`;
            enemiesHtml += `\n        image: '${enemy.image}',`;
            enemiesHtml += `\n        type: '${enemy.type}',`;
            enemiesHtml += `\n        battleDurationMinutes: ${enemy.battleDurationMinutes},`;
            enemiesHtml += `\n    },`;
        });
        enemiesHtml += '\n];';
        fs.writeFile(`./balancing/areas/${area}/enemies.ts`, enemiesHtml, { encoding: 'utf8' }, () => { });
    });
});    

