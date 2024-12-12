const fs = require('fs');

let readInput = () => {
    let res = fs.readFileSync('./input.txt');
    // let res = fs.readFileSync('./test-input.txt');
    res = res.toString().split('\n').map(line => line.trim())
    return res;
}

const uniqueLocations = (arr) => {
    const map = new Map(); // key: frequency symbol, value: array of pairs of coordinates
    const height = arr.length
    const width = arr[0].length

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const symbol = arr[i][j]
            if (symbol !== '.') {
                if (!map.has(symbol)) {
                    map.set(symbol, [[i, j]])
                } else {
                    map.get(symbol).push([i, j])
                }
            }
        }
    }

    // will hold antinode locations
    let res = new Array(height)
    for (let i = 0; i < height; i++) {
        res[i] = new Array(width)
    }

    const isInBounds = (pair) => {
        if (pair[0] < 0) return false
        if (pair[1] < 0) return false
        if (pair[0] >= height) return false
        if (pair[1] >= width) return false
        return true
    }

    for (const [, pairs] of map.entries()) {

        for (let i = 0; i < pairs.length - 1; i++) {
            for (j = i + 1; j < pairs.length; j++) {
                const a = pairs[i]
                const b = pairs[j]
                const heightDiff = a[0] - b[0]
                const widthDiff = a[1] - b[1]
                const antinode1 = [a[0] + heightDiff, a[1] + widthDiff]
                const antinode2 = [b[0] - heightDiff, b[1] - widthDiff]
                // x .
                // . x
                // [0,0], [1,1
                // diff [-1, -1]

                // . X
                // X . 
                // [0,1], [1,0]
                // diff[-1, 1]

                if (isInBounds(antinode1)) {
                    res[antinode1[0]][antinode1[1]] = '#'
                }
                if (isInBounds(antinode2)) {
                    res[antinode2[0]][antinode2[1]] = '#'
                }
            }
        }
    }


    let count = 0
    for (const line of res) {
        for (const el of line) {
            if (el === '#') {
                count++
            }
        }
    }
    return count
}


let main = () => {
    let arr = readInput();
    let locs = uniqueLocations(arr);
    console.log(locs);
}

main();