const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input23.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

const SPACER = 100000000n;

h = (x, y, z) => BigInt(x) * SPACER * SPACER + BigInt(y) * SPACER + BigInt(z);
let unhash = (hash) => {
    const z = hash % SPACER;
    hash = (hash / SPACER);
    const y = hash % SPACER
    const x = (hash / SPACER);
    return [x, y, z].map(Number);
}
let dist = (a, b) => {
    let res = 0;
    for (let i = 0; i < a.length; i++) {
        res += Math.abs(a[i] - b[i])
    }
    return res;
}

markAllPoints = (c, r, numberOfBotsInRange) => {
    let points = new Set();
    for (let dx = 0; dx <= r; dx++) {
        for (let dy = 0; dy <= r - dx; dy++) { // sum = dy+dz
            let dz = r - dx - dy;
            let direction = [[1, 1, 1], [1, 1, -1],
            [1, -1, 1], [1, -1, -1],
            [1, -1, 1], [1, -1, -1],
            [-1, 1, 1], [-1, -1, -1]];
            for (const d of direction) {
                const point = [c[0] + dx * d[0],
                c[1] + dy * d[1],
                c[2] + dz * d[2]];
                if (!points.has(h(...point))) {
                    let count = numberOfBotsInRange.get(h(...point)) || 0;
                    numberOfBotsInRange.set(h(...point), count + 1);
                }
                points.add(h(...point));
            }
        }
    }
}

let main = async () => {
    let inputs = await readInput();
    let nanobots = new Map();

    for (const line of inputs) {
        const m = line.match(/^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/)
        const [x, y, z] = [m[1], m[2], m[3]].map(Number);
        const r = Number(m[4]);
        nanobots.set(h(x, y, z), r);
    }

    // < hash, number of bots in range>
    let numberOfBotsInRange = new Map();
    for (const [hash, r] of [...nanobots]) {
        for (let i = 0; i <= r; i++) {
            markAllPoints(unhash(hash), i, numberOfBotsInRange);
        }
    }

    let maxCount = 0;
    let maxHashes = [];
    for (const [hash, count] of [...numberOfBotsInRange.entries()]) {
        if (count > maxCount) {
            maxHashes = [];
            maxCount = count;
            maxHashes.push(hash);
        } else if (count === maxCount) {
            maxHashes.push(hash);
        }
    }

    let points = [];
    let minDist = Number.POSITIVE_INFINITY;
    console.log(maxHashes);



    for (let hash of maxHashes) {
        const [x, y, z] = unhash(hash);
        let dist = x + y + z;
        if (dist < minDist) {
            points.push([x, y, z]);
        }
    }
    points.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
    let destination = points[0];
    console.log(destination.reduce((v,acc) => v + acc));


}

main();