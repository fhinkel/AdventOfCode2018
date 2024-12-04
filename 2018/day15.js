const fs = require('fs').promises;
const GOBLIN_POWER = 3;

let readInput = async () => {
    let res = await fs.readFile('./input15.txt');
    // let res = await fs.readFile('./47-590.txt');
    // let res = await fs.readFile('./37-982.txt');
    // let res = await fs.readFile('./20-937.txt');
    // let res = await fs.readFile('./54-536.txt');
    // let res = await fs.readFile('./35-793.txt');
    // let res = await fs.readFile('./46-859.txt');
    // let res = await fs.readFile('./testInput.txt');
    // let res = await fs.readFile('./reddit.txt');

    let inputs = res.toString().split('\n');

    return inputs
}

let initialize = (inputs) => {
    let board = Array(inputs.length).fill().map(() => []);
    let elves = new Map();
    let goblins = new Map();
    // {i, j, hitPoints = 200 }

    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < inputs[0].length; j++) {
            board[j][i] = inputs[i][j];
            if (inputs[i][j] === 'E') {
                let elf = { x: j, y: i, u: 'E', hitPoints: 200 };
                elves.set(elf.y * 100 + elf.x, elf);
            }
            if (inputs[i][j] === 'G') {
                let goblin = { x: j, y: i, u: 'G', hitPoints: 200 };
                goblins.set(goblin.y * 100 + goblin.x, goblin);
            }
        }
    }

    return [board, elves, goblins];
}

let unitsort = (u1, u2) => {
    if (u1.y !== u2.y) {
        return u1.y - u2.y;
    }
    return u1.x - u2.x;
}
let arraysort = (a, b) => {
    if (a[1] === b[1]) {
        return a[0] - b[0];
    }
    return a[1] - b[1];
};


let sortUnits = (elves, goblins) => {
    return [...elves.entries(), ...goblins.entries()].sort((a, b) => {
        return a[0] - b[0];
    });
}

let unique = (e, i, a) => {
    return a.findIndex(el => el[0] === e[0] && el[1] === e[1]) === i;
}

let distance = (src, target, board) => {
    let sx = src.x;
    let sy = src.y;
    let tx = target[0];
    let ty = target[1];
    if (sx === tx && sy === ty) {
        return [0, []];
    }

    let visited = new Set();

    let reachable = [[sy * 100 + sx, [sx, sy]]];
    let newReachable = [];

    let dist = 0;
    let searching = true;
    let firstSteps = [];

    while (dist < board.length * board[0].length && searching) {
        for (let [hash, pos] of reachable) {
            let firstStep = [pos[2], pos[3]];
            let [x, y] = pos;
            if (x === tx && y === ty) {
                // reached the target
                searching = false;
                firstSteps.push(firstStep);
                continue;
            }
            if (y - 1 >= 0 && board[x][y - 1] === '.') {
                firstStep = dist === 0 ? [x, y - 1] : firstStep;
                newReachable.push([x, y - 1, ...firstStep]);
            }
            if (x - 1 >= 0 && board[x - 1][y] === '.') {
                firstStep = dist === 0 ? [x - 1, y] : firstStep;
                newReachable.push([x - 1, y, ...firstStep]);
            }
            if (x + 1 < board.length && board[x + 1][y] === '.') {
                firstStep = dist === 0 ? [x + 1, y] : firstStep;
                newReachable.push([x + 1, y, ...firstStep]);
            }
            if (y + 1 < board[0].length && board[x][y + 1] === '.') {
                firstStep = dist === 0 ? [x, y + 1] : firstStep;
                newReachable.push([x, y + 1, ...firstStep]);
            }
        }

        newReachable.sort((a, b) => {
            if (a[1] === b[1]) {
                if (a[0] === b[0]) {
                    if (a[3] === b[3]) {
                        return a[2] - b[2];
                    }
                    return a[3] - b[3];
                }
                return a[0] - b[0];
            }
            return a[1] - b[1];
        });

        let reachablesMap = new Map();
        for (let square of newReachable) {
            const hash = square[1] * 100 + square[0];
            if (!reachablesMap.has(hash) && !visited.has(hash)) {
                reachablesMap.set(hash, square);
                visited.add(hash);
            }
        }

        reachable = [...reachablesMap.entries()].sort((a, b) => {
            return a[0] - b[0];
        });


        newReachable = [];
        dist++;
    }

    if (searching) {
        return [Number.MAX_SAFE_INTEGER, []];
    }
    dist--;
    firstSteps.sort(arraysort)
    return [dist, firstSteps[0]];
}

let getDirection = (unit, opponents, board) => {
    let inRange = [];

    for (let oppenent of [...opponents.values()]) {
        let [ox, oy] = [oppenent.x, oppenent.y];

        if (oy - 1 >= 0 && (board[ox][oy - 1] === '.' || (ox === unit.x && oy - 1 === unit.y))) {
            inRange.push([ox, oy - 1]);
        }
        if (ox - 1 >= 0 && (board[ox - 1][oy] === '.' || (ox - 1 === unit.x && oy === unit.y))) {
            inRange.push([ox - 1, oy]);
        }
        if (ox + 1 < board.length && (board[ox + 1][oy] === '.' || (ox + 1 === unit.x && oy === unit.y))) {
            inRange.push([ox + 1, oy]);
        }
        if (oy + 1 < board[0].length && (board[ox][oy + 1] === '.' || (ox === unit.x && oy + 1 === unit.y))) {
            inRange.push([ox, oy + 1]);
        }
    }

    inRange = inRange.filter(unique).sort(arraysort);

    let rightStep;
    let min = Number.MAX_SAFE_INTEGER;
    for (let range of inRange) {
        let [d, firstStep] = distance(unit, range, board);
        if (d < min) {
            min = d;
            rightStep = firstStep;
        }
    }

    return [min, rightStep];
}

let print = (board) => {
    console.log()
    let row = '';
    for (let i = 0; i < board[0].length; i++) {
        for (let j = 0; j < board.length; j++) {
            row = row + board[j][i];
        }
        console.log(row);
        row = '';
    }
}

let findTargets = (unit, opponents, board) => {
    let letter = unit.u;
    let x = unit.x;
    let y = unit.y;
    let targets = [];

    let targetLetter = 'G';
    if (letter === targetLetter) {
        targetLetter = 'E';
    }

    if (y - 1 >= 0 && board[x][y - 1] === targetLetter) {
        targets.push([x, y - 1]);
    }
    if (x - 1 >= 0 && board[x - 1][y] === targetLetter) {
        targets.push([x - 1, y]);
    }
    if (x + 1 < board.length && board[x + 1][y] === targetLetter) {
        targets.push([x + 1, y]);
    }
    if (y + 1 < board[0].length && board[x][y + 1] === targetLetter) {
        targets.push([x, y + 1]);
    }

    let ops = []
    for (let target of targets) {
        let hash = target[1] * 100 + target[0];
        if (opponents.has(hash)) {
            ops.push(opponents.get(hash))[1];
        }
    }

    return ops;
}

let attack = (unit, opponents, board, elfPower) => {
    let targets = findTargets(unit, opponents, board);
    if (targets.length === 0) {
        // nobody to attack
        print(board);
        console.log(opponents);
        console.log(`this should not happen for ${unit.x}, ${unit.y}, ${unit.u}`)

    }

    let minHitPoints = Number.MAX_SAFE_INTEGER;
    for (let target of targets) {
        if (target.hitPoints < minHitPoints) {
            minHitPoints = target.hitPoints;
        }
    }

    targets = targets.filter(t => t.hitPoints === minHitPoints).sort(unitsort);

    let dead;
    let power = targets[0].u === 'G' ? elfPower : GOBLIN_POWER;

    if (minHitPoints > power) {
        targets[0].hitPoints -= power;
    } else {
        dead = targets[0];
        // console.log(`${dead.u} died`);
        dead.dead = true;
        opponents.delete(dead.y * 100 + dead.x);
        board[dead.x][dead.y] = '.';
    }
    // console.log(`new size: ${opponents.size}`)
    return opponents;

}

let main = async () => {
    elfPower = 4;
    let initialElves;
    while (true) {
        let inputs = (await readInput());
        let [board, elves, goblins] = initialize(inputs);
        initialElves = elves.size;
        let units = sortUnits(elves, goblins);

        let count = 0;

        let ops = true;
        // print(board);
        while (ops && count < 300) {
            for (let [hash, unit] of units) {
                if (unit.dead) {
                    continue;
                }
                let opponents = elves;
                if (unit.u === 'E') {
                    opponents = goblins;
                }

                if (opponents.size === 0) {
                    // No more opponents
                    ops = false;
                    break;
                }

                let [d, firstStep] = getDirection(unit, opponents, board);
                if (firstStep) {
                    if (firstStep.length > 0) {
                        board[unit.x][unit.y] = '.';
                        [unit.x, unit.y] = firstStep;
                        if (unit.u === 'E') {
                            elves.delete(hash);
                            elves.set(100 * unit.y + unit.x, unit);
                        } else {
                            goblins.delete(hash);
                            goblins.set(100 * unit.y + unit.x, unit);
                        }
                        board[unit.x][unit.y] = unit.u;
                    } else {
                    }
                    if (d <= 1) {
                        let newOpponents = attack(unit, opponents, board, elfPower);
                        if (unit.u === 'E') {
                            goblins = newOpponents;
                        } else {
                            if (opponents.length > newOpponents.length) {
                                // elf died
                                ops = false;
                            }
                            elves = newOpponents;
                        }
                    }
                } else {
                }
                first = false;
            }
            // print(board);
            units = sortUnits(elves, goblins);
            count++;
        }
        count--;
        let power = 0;
        for (let goblin of [...goblins.values()].sort(unitsort)) {
            // console.log(goblin)
            power += goblin.hitPoints;
        }
        for (let elf of [...elves.values()]) {
            // console.log(elf);
            power += elf.hitPoints;
        }
        console.log(`Power ${elfPower}: ${count} * ${power}, product ${power * count}`);
        if (goblins.size === 0 && elves.size === initialElves) {
            return;
        }
        elfPower++;
    }
}

main();