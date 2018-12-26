const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input24.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let parseInput = (inputs) => {
    let infectionReadIn = false;
    let immuneArmy = [];
    let infectionArmy = [];
    let countImmune = 1;
    let countInfection = 1;
    for (const line of inputs) {
        if (line === 'Immune System:') {
            continue;
        }
        if (line === 'Infection:') {
            infectionReadIn = true;
            continue;
        }
        if (line === '') {
            continue;
        }
        let [numberOfUnits, hitPoints, attackDamage, initiative] = line.match(/(\d+)/g).map(Number);

        let parseList = (verb, line) => {

            let re = new RegExp(`${verb} to (.*?)(;|\\))`)
            let diseases = line.match(re);
            if (!diseases) {
                diseases = [];
            } else {
                diseases = diseases.splice(1)[0].split(', ');
            }
            return diseases;
        }

        let weakness = parseList('weak', line);
        let immune = parseList('immune', line);
        let damage = line.match(/does \d+ (.*) damage at/)[1];


        let effectivePower = numberOfUnits * attackDamage;
        let group = {
            numberOfUnits,
            hitPoints,
            attackDamage,
            initiative,
            effectivePower,
            weakness,
            immune,
            damage
        }
        if (infectionReadIn) {
            group.type = 'infection';
            group.number = countInfection;
            countInfection++;
            infectionArmy.push(group);
        } else {
            group.type = 'immune';
            group.number = countImmune;
            countImmune++;
            immuneArmy.push(group);
        }
    }
    return [infectionArmy, immuneArmy];
}

let sortOpponents = (opponents, damageType) => {
    opponents.sort((g1, g2) => {
        if (g1.weakness.indexOf(damageType) !== -1) {
            if (g2.weakness.indexOf(damageType) !== -1) {
                if (g2.effectivePower === g1.effectivePower) {
                    return g2.initiative - g1.initiative;
                }
                return g2.effectivePower - g1.effectivePower;
            }
            return -1;
        }
        if (g2.weakness.indexOf(damageType) !== -1) {
            return 1;
        }
        if (g1.immune.indexOf(damageType) !== -1) {
            return 1;
        }
        if (g2.immune.indexOf(damageType) !== -1) {
            return -1;
        }
        if (g2.effectivePower === g1.effectivePower) {
            return g2.initiative - g1.initiative;
        }
        return g2.effectivePower - g1.effectivePower;
    });
}

let main = async () => {
    let inputs = await readInput();
    let [infectionArmy, immuneArmy] = parseInput(inputs);

    let count = 2;
    while (infectionArmy.length !== 0 && immuneArmy.length !== 0) {
        count--;
        let allGroups = [...infectionArmy, ...immuneArmy];

        console.log(allGroups)
        // Target selection order
        allGroups.sort((g1, g2) => {
            if (g1.effectivePower === g2.effectivePower) {
                return g1.initiative - g2.initiative;
            }
            return g1.effectivePower - g2.effectivePower;
        });

        console.log('total groups', allGroups.length)

        // Select targets
        for (let i = allGroups.length - 1; i >= 0; i--) {
            let opponents = infectionArmy;
            let attacker = allGroups[i];
            if (attacker.type === 'infection') {
                opponents = immuneArmy;
            }
            let damage = attacker.damage;
            sortOpponents(opponents, attacker.damage);
            if (opponents.length === 0) {
                attacker.opponent = undefined;
                console.log('no opponents left that can be selected')
                continue;
            }

            if (opponents[0].immune.indexOf(damage) !== -1) {
                attacker.opponent = undefined;
                console.log(`${attacker.type} #${attacker.number} has only immune opponents`)
                continue;
            }
            attacker.opponent = opponents.shift();

            console.log(attacker.type, attacker.number,
                attacker.effectivePower, attacker.opponent.number);
        }

        // Attack order
        allGroups.sort((g1, g2) => g1.initiative - g2.initiative);

        // Attack opponents
        for (let i = allGroups.length - 1; i >= 0; i--) {
            let attacker = allGroups[i];
            if (!attacker.opponent) {
                continue;
            }
            if (attacker.dead) {
                continue;
            }
            let damageTaken = attacker.effectivePower;
            if (attacker.opponent.weakness.indexOf(attacker.damage) !== -1) {
                damageTaken = damageTaken * 2;
            } else if (attacker.opponent.immune.indexOf(attacker.damage) !== -1) {
                console.log(Wrong, attacker);
                throw new Error();
            }
            console.log(`Attacking with ${damageTaken} on ${attacker.opponent.hitPoints} per unit`)
            let killed = Math.min(Math.floor(damageTaken / attacker.opponent.hitPoints), attacker.opponent.numberOfUnits);
            console.log(`${attacker.type} #${attacker.number} attacks group ${attacker.opponent.number}, killing ${killed}`)
            attacker.opponent.numberOfUnits -= killed;
            attacker.opponent.effectivePower = attacker.opponent.numberOfUnits * attacker.opponent.attackDamage;
            if (attacker.opponent.numberOfUnits === 0) {
                attacker.opponent.dead = true;
            }
        }

        immuneArmy = [];
        infectionArmy = [];
        for (let i = allGroups.length - 1; i >= 0; i--) {
            if (allGroups[i].dead) {
                continue;
            }
            if (allGroups[i].type === 'immune') {
                immuneArmy.push(allGroups[i]);
            } else {
                infectionArmy.push(allGroups[i]);
            }
        }
        console.log();
    }
    let winner = infectionArmy;
    if (immuneArmy.length > 0) {
        winner = immuneArmy;
    }
    console.log(winner[0].type)
    let sum = winner.reduce((acc, g) => {
        return g.numberOfUnits + acc
    }, 0)
    console.log(sum);

    // 19947 too low
}


main();