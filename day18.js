const fs = require('fs').promises;

let SIZE = 50;


let readInput = async () => {
    let res = await fs.readFile('./input18.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}


let adjacent = (board, x, y) => {
    let fields = [];
    if (y > 0) {
        if (x > 0) {
            fields.push([y - 1, x - 1]);
        }
        fields.push([y - 1, x])
        if (x < SIZE - 1) {
            fields.push([y - 1, x + 1]);
        }
    }
    if (x > 0) {
        fields.push([y, x - 1]);
    }
    if (x < SIZE - 1) {
        fields.push([y, x + 1]);
    }
    if (y < SIZE - 1) {
        if (x > 0) {
            fields.push([y + 1, x - 1]);
        }
        fields.push([y + 1, x])
        if (x < SIZE - 1) {
            fields.push([y + 1, x + 1]);
        }
    }

    // [open spaces, trees, lumberyards]
    let res = [0, 0, 0];
    for (let [j, i] of fields) {
        if (board[j][i] === '.') {
            res[0] = res[0] + 1;
        } else if (board[j][i] === '|') {
            res[1] = res[1] + 1;
        } else if (board[j][i] === '#') {
            res[2] = res[2] + 1;
        }
    }

    return res;
}

let newField = (board, x, y) => {
    let [, tree, lumberyard] = adjacent(board, x, y);
    if (board[y][x] === '.') {
        if (tree >= 3) {
            return '|';
        } else {
            return '.';
        }
    }

    if (board[y][x] === '|') {
        if (lumberyard >= 3) {
            return '#';
        } else {
            return '|';
        }
    }
    if (board[y][x] === '#') {
        if (lumberyard === 0 || tree === 0) {
            return '.';
        } else {
            return '#';
        }
    }
}

let getResourceNumber = (board) => {
    let wood = 0;
    let lumberyard = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === '|') {
                wood++;
            } else if (board[i][j] === '#') {
                lumberyard++;
            }
        }
    }
    return lumberyard * wood;
}

let main = async () => {

    let inputs = await readInput();

    let board = Array(SIZE).fill().map(() => []);
    let i = 0;
    for (let line of inputs) {
        board[i] = line.split('');
        i++;
    }

    let resourceNumber = [];
    let s = new Map();
    let newBoard = Array(SIZE).fill().map(() => []);

    let n = getResourceNumber(board);
    resourceNumber.push(n);

    let end = 2000;
    for (let time = 0; time < end; time++) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                newBoard[i][j] = newField(board, j, i);
            }
        }
        for (let i = 0; i < board.length; i++) {
            board[i] = newBoard[i].slice();
        }
        let n = getResourceNumber(board);
        resourceNumber.push(n);
    }

    let last = resourceNumber[resourceNumber.length - 1];
    let repeatIndex = resourceNumber.lastIndexOf(last, resourceNumber.length - 2)
    let cycleLength = end - repeatIndex;
    for (let i = end - cycleLength - cycleLength; i < end - cycleLength; i++) {
        if (resourceNumber[i] !== resourceNumber[i + cycleLength]) {
            console.log("no match");
            throw new Error();
        }
    }

    let B = 1000000000;

    let index = (B - end) % cycleLength;

    console.log(resourceNumber[repeatIndex - cycleLength + index]);
}

main();