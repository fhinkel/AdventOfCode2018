const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input15.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs
}

let initialize = (inputs) => {
    let board = Array(inputs.length).fill().map(() => []);
    let elfs = new Set();
    let goblins = new Set();
    // {i, j, hitPoints = 200 }

    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < inputs[0].length; j++) {
            board[j][i] = inputs[i][j];
            if (inputs[i][j] === 'E') {
                let elf = { x: j, y: i, u: 'E', hitPoints: 200 };
                elfs.add(elf);
            }
            if (inputs[i][j] === 'G') {
                let goblin = { x: j, y: i, u: 'G', hitPoints: 200 };
                goblins.add(goblin);
            }
        }
    }

    return [board, elfs, goblins];
}

let initializeEG = (board) => {
    let elfs = new Set();
    let goblins = new Set();

    for (let i = 0; i < board.length; i++) { // left to right
        for (let j = 0; j < board[0].length; j++) { // top to bottom
            if (board[i][j] === 'E') {
                let elf = { x: i, y: j, u: 'E', hitPoints: board[i][j].hitPoints };
                elfs.add(elf);
            }
            if (board[i][j] === 'G') {
                let goblin = { x: i, y: j, u: 'G', hitPoints: board[i][j].hitPoints };
                goblins.add(goblin);
            }
        }
    }

    return [elfs, goblins];
}


let sortUnits = (elfs, goblins) => {
    let units = [...elfs.values(), ...goblins.values()];

    units.sort((u1, u2) => {
        if (u1.y !== u2.y) {
            return u1.y - u2.y;
        }
        return u1.x - u2.x;
    });

    return units;
}

let findDirectOppononent = (x, y, letter, board) => {
    if (y - 1 >= 0 && board[x][y - 1] === letter) {
        // attack the top opponent
        return [x, y - 1];
    }
    if (x - 1 >= 0 && board[x - 1][y] === letter) {
        // attack the left opponent
        return [x - 1, y];
    }
    if (x + 1 < board.length && board[x + 1][y] === letter) {
        // attack the right opponent
        return [x + 1, y];
    }
    if (y + 1 < board[0].length && board[x][y + 1] === letter) {
        // attack the bottom opponent
        return [x, y + 1];
    }
}

let search = (x, y, letter, board) => {
    let reachable = [[x, y]];
    let newReachable = [];

    let max = board.length * board[0].length;
    // console.log(`Searching at most ${max} times`);
    while (max) {
        for (let pos of reachable) {
            [x, y] = pos;
            if (y - 1 >= 0 && board[x][y - 1] === '.') {
                newReachable.push([x, y - 1]);
            }
            if (x - 1 >= 0 && board[x - 1][y] === '.') {
                newReachable.push([x - 1, y]);
            }
            if (x + 1 < board.length && board[x + 1][y] === '.') {
                newReachable.push([x + 1, y]);
            }
            if (y + 1 < board[0].length && board[x][y + 1] === '.') {
                newReachable.push([x, y + 1]);
            }
        }
        reachable = newReachable.filter(unique);
        // console.log(reachable);
        max--;
    }
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

    let dist = 1;
    while (dist < board.length * board[0].length) {
        for (let pos of reachable) {
            let firstStep = [pos[2], pos[3]];
            let [x, y] = pos;
            if (x === tx && y === ty) {
                // reached the target
                return [dist, firstStep];
            }
            if (y - 1 >= 0 && board[x][y - 1] === '.') {
                firstStep = dist === 1 ? [x, y - 1] : firstStep;
                newReachable.push([x, y - 1, ...firstStep]);
            }
            if (x - 1 >= 0 && board[x - 1][y] === '.') {
                firstStep = dist === 1 ? [x - 1, y] : firstStep;
                newReachable.push([x - 1, y, ...firstStep]);
            }
            if (x + 1 < board.length && board[x + 1][y] === '.') {
                firstStep = dist === 1 ? [x + 1, y] : firstStep;
                newReachable.push([x + 1, y, ...firstStep]);
            }
            if (y + 1 < board[0].length && board[x][y + 1] === '.') {
                firstStep = dist === 1 ? [x, y + 1] : firstStep;
                newReachable.push([x, y + 1, ...firstStep]);
            }
        }

        newReachable.sort((a, b) => {
            if (a[1] === b[1]) {
                if (a[0] === b[0]) {
                    if (a[3] === b[3]) {
                        return a[2] - b[2];
                    }
                    a[3] - b[3];
                }
                return a[0] - b[0];
            }
            return a[1] - b[1];
        });

        reachable = newReachable.filter(unique);
        newReachable = [];

        dist++;
    }

    // console.log(`didnt find anyting: ${src.x}, ${src.y}`);
    return [Number.MAX_SAFE_INTEGER, []];
}

let findInRangeField = (unit, opponents, board) => {
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

    inRange.filter(unique).sort((a, b) => {
        if (a[1] === b[1]) {
            return a[0] - b[0];
        }
        return a[1] - b[1];
    });

    let rightStep;
    let min = Number.MAX_SAFE_INTEGER;
    for (let range of inRange) {
        let [d, firstStep] = distance(unit, range, board);
        if (d < min) {
            min = d;
            rightStep = firstStep;
        }
    }

    return rightStep;
}

let print = (board) => {
    let row = '';
    for (let i = 0; i < board[0].length; i++) {
        for (let j = 0; j < board.length; j++) {
            row = row + board[j][i];
        }
        console.log(row);
        row = '';
    }
}

let main = async () => {
    let inputs = (await readInput());
    let [board, elfs, goblins] = initialize(inputs);
    let units = sortUnits(elfs, goblins);

    let i = 5;

    while (i > 0) {
        for (let unit of units) {
            console.log(unit)
            let opponents = elfs;
            if (unit.u === 'E') {
                opponents = goblins;
            }

            if (opponents.length === 0) {
                // No more opponents
                return;
            }

            let firstStep = findInRangeField(unit, opponents, board);
            if (firstStep) {
                if (firstStep.length > 0) {
                    board[unit.x][unit.y] = '.';
                    [unit.x, unit.y] = firstStep;
                    console.log(`moved to ${unit.x}, ${unit.y}`);
                    board[unit.x][unit.y] = unit.u;
                } else {
                    console.log(`Standing still ${unit.x}, ${unit.y}`);
                }
            } else {
                console.log(`No more moves for ${unit.x}, ${unit.y}`);
            }
        }
        print(board);
        [elfs, goblins] = initializeEG(board);
        units = sortUnits(elfs, goblins);
        i--;
    }
}


main();



// After 1 round:
// #########
// #.G...G.#
// #...G...#
// #...E..G#
// #.G.....#
// #.......#
// #G..G..G#
// #.......#
// #########

// After 2 rounds:
// #########
// #..G.G..#
// #...G...#
// #.G.E.G.#
// #.......#
// #G..G..G#
// #.......#
// #.......#
// #########

// After 3 rounds:
// #########
// #.......#
// #..GGG..#
// #..GEG..#
// #G..G...#
// #......G#
// #.......#
// #.......#
// #########