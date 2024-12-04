const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input23.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let parseInput = (inputs) => {
    let nanobots = [];
    let max = [0, 0, 0];
    let min = [0, 0, 0];
    for (const line of inputs) {
        const m = line.match(/^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/)
        const bot = [m[1], m[2], m[3]].map(Number);
        for (let i = 0; i < 3; i++) {
            if (max[i] < bot[i]) {
                max[i] = bot[i];
            } if (min[i] > bot[i]) {
                min[i] = bot[i];
            }
        }
        const r = Number(m[4]);
        nanobots.push([...bot, r]);
    }
    return [nanobots, min, max];
}

let manhattanD = (x, y, z) => Math.abs(x) + Math.abs(y) + Math.abs(z);

let main = async () => {
    let inputs = await readInput();
    let [nanobots, min, max] = parseInput(inputs);

    let gridsize = max[0] - min[0];

    let bestGrid;
    while (gridsize > 0) {
        let maxCount = 0;

        for (let x = min[0]; x < max[0] + 1; x += gridsize) {
            for (let y = min[1]; y < max[1] + 1; y += gridsize) {
                for (let z = min[2]; z < max[2] + 1; z += gridsize) {
                    let count = 0;
                    for (const [ax, ay, az, r] of nanobots) {
                        let dist = Math.abs(x - ax) + Math.abs(y - ay) + Math.abs(z - az);
                        if (dist-r<gridsize) {
                            count++;
                        }
                    }
                    if (maxCount < count) {
                        maxCount = count;
                        bestGrid = [x, y, z];
                    }
                    else if (maxCount === count) {
                        if (!bestGrid || manhattanD(x, y, z) < manhattanD(...bestGrid)) {
                            bestGrid = [x, y, z];
                        }
                    }
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            min[i] = bestGrid[i] - gridsize;
            max[i] = bestGrid[i] + gridsize;
        }

        gridsize = Math.floor(gridsize / 2);
    }
    console.log(manhattanD(...bestGrid));
    console.log(bestGrid);
}

main();