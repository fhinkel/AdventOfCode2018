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

    let [x, y] = findGuard()
    const direction = arr[x][y]
    arr[x][y] = 'X'
    let dir;
    let marker;
    switch (direction) {
        case '^':
            dir = [-1, 0]
            marker = '^'
            break;
        case 'v':
            dir = [1, 0]
            marker = 'v'
            break;
        case '<':
            dir = [0, -1]
            marker = '<'
            break;
        case '>':
            dir = [0, 1]
            marker = '>'
            break;
    }

    const inBounds = (x, y) => {
        if (x < 0) return false
        if (y < 0) return false
        if (x >= height) return false
        if (y >= width) return false
        return true
    }

    const endsInLoop = (x, y, marker, dir, arr) => {
        let visited = []
        for (let i = 0; i < height; i++) {
            let line = []
            for (let j = 0; j < width; j++) {
                line.push(new Set())
            }
            visited.push(line)
        }

        while (true) {
            while (inBounds(x, y) && arr[x][y] !== '#') {
                if (visited[x][y].has(marker)) {
                    return 1
                }
                visited[x][y].add(marker)
                x += dir[0]
                y += dir[1]
            }

            if (!inBounds(x, y)) {
                // out of bounds, not stuck in loop
                return 0
            }

            // hit obstacle
            // one step back
            x -= dir[0]
            y -= dir[1]
            // turn right
            if (dir[0] + dir[1] < 0 && dir[1] === 0) { // up
                // right
                dir = [0, 1]
                marker = '>'
            } else if (dir[0] + dir[1] < 0 && dir[0] === 0) {// left
                // up
                dir = [-1, 0]
                marker = '^'
            } else if (dir[0] + dir[1] > 0 && dir[0] === 0) {// right
                // down
                dir = [1, 0]
                marker = 'v'
            } else {// down
                // left
                dir = [0, -1]
                marker = '<'
            }
        }
    }

    let count = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (arr[i][j] === '^')
                continue
            if (arr[i][j] === '#')
                continue
            const copy = []
            for (const line of arr) {
                copy.push([...line])
            }
            copy[i][j] = '#' // newly placed obstacle
            console.log(i, j)
            // console.log(copy)
            count += endsInLoop(x, y, marker, dir, copy)

        }
    }

    return count
}

let main = () => {
    let arr = readInput();
    let sum = positions(arr);
    console.log(sum);
}

main();