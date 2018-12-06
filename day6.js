const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input6.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let findDimensions = (inputs) => {
    // 1, 6 - x, y
    let xMax = 0;
    let yMax = 0;
    for (let input of inputs) {
        let [x, y] = input.split(',').map(Number);
        if (x > xMax) {
            xMax = x;
        }
        if (y > yMax) {
            yMax = y;
        }
    }
    return [xMax, yMax];
}

let distance = (input, point) => {
    let [x, y] = input.split(',').map(Number);
    let [i, j] = point;
    return Math.abs(x - i) + Math.abs(y - j);
}

let markDistances = (inputs, x, y) => {
    // Mark each point on the board with distances to inputs
    let board = [];
    for (let i = 0; i <= x; i++) {
        board.push([]);
        for (let j = 0; j <= y; j++) {
            // <input, [distances]>
            board[i][j] = new Map();
        }

    }
    for (let i = 0; i <= x; i++) {
        for (let j = 0; j <= y; j++) {
            let point = [i, j];
            for (let input of inputs) {
                let d = distance(input, point);
                board[i][j].set(input, d);
            }
        }
    }
    return board;
}

const REGION_SIZE = 10000;
let main = async () => {
    let inputs = await readInput();
    let [x, y] = findDimensions(inputs);
    // console.log(x, y);
    let board = markDistances(inputs, x, y);

    let regionSize = 0;
    for (let i = 0; i <= x; i++) {
        for (let j = 0; j <= y; j++) {
            // <input, [distances]>
            let sum = [...board[i][j].values()].reduce((acc, v) => acc + v, 0);
            if (sum < REGION_SIZE) {
                regionSize++;
            }
        }
    }
    console.log(regionSize);
}

main();