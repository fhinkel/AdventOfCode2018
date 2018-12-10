const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input10.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let parseInputLine = (line) => {
    // position=< 9,  1> velocity=< 0,  2>
    let m = line.match(/position=<(?<pos>.*)> velocity=<(?<vel>.*)>/);
    let [x, y] = m.groups.pos.split(',').map(Number);
    let [dx, dy] = m.groups.vel.split(',').map(Number);
    return [x, y, dx, dy];
}

let boardDimensions = (inputs) => {
    let maxX = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    for (let line of inputs) {
        let [x, y, dx, dy] = parseInputLine(line);
        if (x > maxX) {
            maxX = x;
        }
        if (x < minX) {
            minX = x;
        }
        if (y > maxY) {
            maxY = y;
        }
        if (y < minY) {
            minY = y;
        }

    }
    console.log(`Board form ${minX} to ${maxX} left to right`)
    console.log(`And from ${minY} to ${maxY} top to bottom`)
    return [minX, maxX, minY, maxY];
}

let printBoard = (board) => {
    for (let i = 0; i < board.length; i++) {
        console.log(board[i].join(''));
    }
    console.log();
}

let main = async () => {
    let inputs = (await readInput());
    let [minX, maxX, minY, maxY] = boardDimensions(inputs);

    let xLength = maxX - minX + 1;
    let xDiff = minX;
    let yLength = maxY - minY + 1;
    let yDiff = minY;
    let board = Array(yLength).fill([]);
    for (let i = 0; i < board.length; i++) {
        let row = Array(xLength).fill('.')
        // console.log(row.join(''));
        board[i] = row;
    }
    printBoard(board);

    for (let line of inputs) {
        let [x, y] = parseInputLine(line);
        // printBoard(board);
        board[x - minX][y - minY] = '#';
    }

    console.log(board);


}

main();