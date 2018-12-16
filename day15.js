const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input15.txt');
    // let res = await fs.readFile('./47-590.txt');
    let res = await fs.readFile('./37-982.txt');
    // let res = await fs.readFile('./20-937.txt');
    // let res = await fs.readFile('./54-536.txt');
    // let res = await fs.readFile('./35-793.txt');
    // let res = await fs.readFile('./46-859.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs
}

let initialize = (inputs) => {
    let board = Array(inputs.length).fill().map(() => []);
    let elves = new Set();
    let goblins = new Set();
    // {i, j, hitPoints = 200 }

    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < inputs[0].length; j++) {
            board[j][i] = inputs[i][j];
            if (inputs[i][j] === 'E') {
                let elf = { x: j, y: i, u: 'E', hitPoints: 200 };
                elves.add(elf);
            }
            if (inputs[i][j] === 'G') {
                let goblin = { x: j, y: i, u: 'G', hitPoints: 200 };
                goblins.add(goblin);
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
    return [...elves.values(), ...goblins.values()].sort(unitsort);
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

    let reachable = [[sx, sy]];
    let newReachable = [];

    let dist = 0;
    let searching = true;
    let firstSteps = [];
    while (dist < board.length * board[0].length && searching) {
        for (let pos of reachable) {
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

        newReachable.sort(arraysort);

        reachable = newReachable.filter(unique);
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

    for (let oppenent of opponents) {
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

    inRange.filter(unique).sort(arraysort);

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
        let opponent = [...opponents].find(o => o.x === target[0] && o.y === target[1]);
        ops.push(opponent);
    }

    return ops;
}

let attack = (unit, opponents, board) => {
    let targets = findTargets(unit, opponents, board);
    if (targets.length === 0) {
        // nobody to attack
        print(board);
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
    if (minHitPoints > 3) {
        targets[0].hitPoints -= 3;
    } else {
        dead = targets[0];
        // console.log(`${dead.u} died`);
        dead.u = 'D';
        let opsArray = [...opponents]
        let deadIndex = opsArray.findIndex(o => o.x === dead.x && o.y === dead.y);
        opsArray.splice(deadIndex, 1);
        board[dead.x][dead.y] = '.';
        opponents = new Set(opsArray);
    }
    // console.log(`new size: ${opponents.size}`)
    return [opponents, dead];

}

let main = async () => {
    let inputs = (await readInput());
    let [board, elves, goblins] = initialize(inputs);
    let units = sortUnits(elves, goblins);

    let count = 0;

    let ops = true;
    while (ops ) {
        console.log(count);
        for (let unit of units) {
            // console.log(unit)
            if (unit.u === 'D') {
                // console.log('skip dead unit');
                continue;
            }
            let opponents = elves;
            if (unit.u === 'E') {
                opponents = goblins;
            }

            if (opponents.size === 0) {
                // No more opponents
                console.log(`Broke in middle or run`)
                ops = false;
                break;
            }

            let [d, firstStep] = getDirection(unit, opponents, board);
            if (firstStep) {
                if (firstStep.length > 0) {
                    board[unit.x][unit.y] = '.';
                    [unit.x, unit.y] = firstStep;
                    board[unit.x][unit.y] = unit.u;
                } else {
                }
                if (d <= 1) {
                    // console.log(`${unit.x}, ${unit.y}, ${unit.u} close enough to attack `);
                    let [newOpponents, dead] = attack(unit, opponents, board);
                    if (unit.u === 'E') {
                        goblins = newOpponents;
                    } else {
                        elves = newOpponents;
                    }
                } else {
                    // console.log(`${unit.x}, ${unit.y}, ${unit.u} NOT close enough to attack: ${d} `);
                }
            } else {
                // console.log(`No more moves for ${unit.x}, ${unit.y}`);
            }
            first = false;
        }
        print(board);
        units = sortUnits(elves, goblins);
        count++;
    }
    count--;
    console.log(`Count is ${count}`);
    let power = 0;
    for (let goblin of [...goblins.values()].sort(unitsort)) {
        console.log(goblin)
        power += goblin.hitPoints;
    }
    for (let elf of [...elves.values()]) {
        console.log(elf);
        power += elf.hitPoints;
    }
    console.log(`${count} - ${power}, product ${power * count}`);
}

main();