const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input23.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

// let h = (x, y, z) => x * 100 * 100 + y * 100 + z;
let dist = (a, b) => {
    let res = 0;
    for (let i = 0; i < a.length; i++) {
        res += Math.abs(a[i] - b[i])
    }
    return res;
}

let main = async () => {
    let inputs = await readInput();
    let strongestRadius = 0;
    let [maxX, maxY, maxZ] = [0, 0, 0];
    let nanobots = [];
    for (const line of inputs) {
        const m = line.match(/^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/)
        const [x, y, z] = [m[1], m[2], m[3]].map(Number);
        const r = Number(m[4]);
        nanobots.push([x, y, z]);
        if (r > strongestRadius) {
            strongestRadius = r;
            [maxX, maxY, maxZ] = [x, y, z]
        }
    }

    let inRange = 0;
    console.log(`strongest: ${[maxX, maxY, maxZ]}: ${strongestRadius}`)
    for (const bot of nanobots) {
        if (dist(bot, [maxX, maxY, maxZ]) <= strongestRadius) {
            inRange++;
        }
    }
    console.log(inRange);
}

main();