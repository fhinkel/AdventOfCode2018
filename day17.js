const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input17.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let flow = (board, x, y, d) => {
    if (board[y][x] === '.') {
        board[y][x] = '|';
    }
    if (board[y][x] === '#') {
        return x;
    }
    if (y === board.length - 1) {
        return;
    }
    if (board[y + 1][x] === '.') {
        flow(board, x, y + 1);
    }
    if (board[y + 1][x] === '#' || board[y + 1][x] === '~') {
        if (d === 'l') {
            return flow(board, x - 1, y, 'l');
        }
        if (d === 'r') {
            return flow(board, x + 1, y, 'r');
        }
        let left = flow(board, x - 1, y, 'l');
        let right = flow(board, x + 1, y, 'r');
        if (board[y][left] === '#' && board[y][right] === '#') {
            for (let i = left + 1; i < right; i++) {
                board[y][i] = '~';
            }
        }
    } else {
        return x;
    }

}

let main = async () => {
    let inputs = await readInput();
    // x=495, y=2..7
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    for (let line of inputs) {
        let [xPart, yPart] = line.split(' ').sort();
        let m = xPart.match(/x=(\d+),/);
        if (m) {
            let x = Number(m[1]);
            let [, left, right] = yPart.match(/y=(\d+)\.\.(\d+)/).map(Number);
            if (x > maxX) {
                maxX = x;
            } else if (x < minX) {
                minX = x;
            }
            if (left < minY) {
                minY = left;
            }
            if (right > maxY) {
                maxY = right;
            }
        } else {
            m = yPart.match(/y=(\d+),/);
            let y = Number(m[1]);
            let [, left, right] = xPart.match(/x=(\d+)\.\.(\d+)/).map(Number);
            if (y > maxY) {
                maxY = y;
            } else if (y < minY) {
                minY = y;
            }
            if (left < minX) {
                minX = left;
            }
            if (right > maxX) {
                maxX = right;
            }
        }
    }

    let width = maxX - minX + 1 + 2; // overflow left and right
    let height = maxY - minY + 1;

    let xOffset = minX - 1;
    let yOffset = minY;

    let board = Array(height).fill().map(() => []);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            board[i][j] = '.';
        }
    }

    for (let line of inputs) {
        let [xPart, yPart] = line.split(' ').sort();
        let m = xPart.match(/x=(\d+),/);
        if (m) {
            let x = Number(m[1]);
            let [, left, right] = yPart.match(/y=(\d+)\.\.(\d+)/).map(Number);
            for (i = left; i <= right; i++) {
                board[i - yOffset][x - xOffset] = '#';
            }
        } else {
            m = yPart.match(/y=(\d+),/);
            let y = Number(m[1]);
            let [, left, right] = xPart.match(/x=(\d+)\.\.(\d+)/).map(Number);
            for (i = left; i <= right; i++) {
                board[y - yOffset][i - xOffset] = '#';
            }
        }
    }

    flow(board, 500 - xOffset, 0);

    for (let i = 0; i < height; i++) {
        // console.log(board[i].join(''));
    }
    
    let water = 0;
    for (let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            if(board[i][j] === '~') {
                water++;
            }
        }
    }
    console.log(water);


}

main();