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
            // <point, [distances]>
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

let closestCoordinates = (board) => {

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            // <point, [distances]>
            let m = board[i][j];
            let distances = [...m.values()];
            distances.sort((a, b) => a - b);
            if (distances[0] === distances[1]) {
                board[i][j] = '.';
            } else {
                let index = [...m.values()].indexOf(distances[0]);
                board[i][j] = [...m.keys()][index];
            }

        }
    }
    return board;
}

let finites = (board) => {
    let valids = new Set(board.reduce((acc, v) => acc.concat(v), []));
    for (let i = 0; i < board.length; i++) {
        // top to bottom
        valids.delete(board[i][0]);
        // console.log(`Delete ${board[i][0]}`);
        valids.delete(board[i][board[0].length - 1]);
    }
    for (let j = 0; j < board[0].length; j++) {
        // left to right
        valids.delete(board[0][j]);
        valids.delete(board[board.length - 1][j]);
    }
    return Array.from(valids);
}


let main = async () => {
    let inputs = await readInput();
    let [x, y] = findDimensions(inputs);
    // console.log(x, y);
    let board = markDistances(inputs, x, y);
    board = closestCoordinates(board);
    let valids = finites(board);
    board = board.reduce((acc, v) => acc.concat(v), []);
    board = board.filter(e => e !== '.');
    board = board.filter(e => valids.indexOf(e) !== -1);

    let m = new Map();
    for (let valid of valids) {
        m.set(valid, 0);
    }

    for (let point of board) {
        m.set(point, m.get(point) + 1);
    }

    console.log(Math.max(...[...m.values()]));

}

main();