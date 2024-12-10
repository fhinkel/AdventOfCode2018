const fs = require('fs');

let readInput = () => {
    let res = fs.readFileSync('./input.txt');
    // let res = fs.readFileSync('./test-input.txt');
    res = res.toString().split('\n').map(line => line.split(''))
    // .#..^.....
    return res;
}

const positions = (arr) => {
    const height = arr.length;
    const width = arr[0].length;

    const guardSymbols = ['^', 'v', '<', '>']
    const findGuard = () => {
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (guardSymbols.includes(arr[i][j])) {
                    return [i, j]
                }
            }
        }
        throw new Error('no guard found anywhere')
    }

    const countSteps = () => {
        let count = 0
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (arr[i][j] === 'X') {
                    count++
                }
            }
        }
        return count
    }

    let [x, y] = findGuard()
    const direction = arr[x][y]
    arr[x][y] = 'X'
    let dir;
    switch (direction) {
        case '^':
            dir = [-1, 0]
            break;
        case 'v':
            dir = [1, 0]
            break;
        case '<':
            dir = [0, -1]
            break;
        case '>':
            dir = [0, 1]
            break;
    }

    const inBounds = (x, y) => {
        if (x < 0) return false
        if (y < 0) return false
        if (x >= height) return false
        if (y >= width) return false
        return true
    }

    while (true) {

        while (inBounds(x, y) &&arr[x][y] !== '#' ) {
            arr[x][y] = 'X'
            x += dir[0]
            y += dir[1]
        }

        if (!inBounds(x, y)) {
            return countSteps()
        }

        // hit obstacle
        // one step back
        x -= dir[0]
        y -= dir[1]
        // turn right
        if (dir[0] + dir[1] < 0 && dir[1] === 0) { // up
            // right
            dir = [0, 1]
        } else if (dir[0] + dir[1] < 0 && dir[0] === 0) {// left
            // up
            dir = [-1, 0]
        } else if (dir[0] + dir[1] > 0 && dir[0] === 0) {// right
            // down
            dir = [1, 0]
        } else {// down
            // left
            dir = [0, -1]
        }
    }
}

let main = () => {
    let arr = readInput();
    let sum = positions(arr);
    console.log(sum);
}

main();