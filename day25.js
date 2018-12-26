const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input25.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let manhattanD = (a, b) => {
    let d = 0;
    for (let i = 0; i < a.length; i++) {
        d += Math.abs(a[i] - b[i]);
    }
    return d;
}

let main = async () => {
    let inputs = await readInput();
    let n = inputs.length;
    let matrix = Array(n).fill().map(() => []);
    let points = [];
    for (const line of inputs) {
        let point = line.match(/(-?\d+)/g).map(Number);
        points.push(point);
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = manhattanD(points[i], points[j]) <= 3;
        }
    }
    let findConstellations = (matrix, index) => {
        let found = 0;
        for (let i = 0; i < n; i++) {
            if (matrix[index][i] === true) {
                matrix[index][i] = false;
                found = 1;
                findConstellations(matrix, i);
            }
        }
        return found;
    }

    let constellations = 0;
    for (let i = 0; i < n; i++) {
        constellations += findConstellations(matrix, i);
    }

    console.log(constellations);
}

main();