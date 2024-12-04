const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input22.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

const Y_LENGTH = 10000
let hash = (x, y, tool) => x * 10 * Y_LENGTH + y * 10 + (tool || 0);


let main = async () => {
    let inputs = await readInput();
    let [, depth] = (inputs[0]).split(' ').map(Number);
    let target = (inputs[1].split(' '))[1];
    let [targetX, targetY] = target.split(',').map(Number);
    let height = 5 + (targetY + 1);
    let width = 50 + (targetX + 1);

    console.log(`${width}x${height}`);
    let m = new Map();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (x + y === 0) {
                m.set(hash(x, y), (0 + depth) % 20183);
                continue;
            }
            if (x === targetX && y === targetY) {
                m.set(hash(x, y), (0 + depth) % 20183);
                console.log('board includes target')
                continue;
            }
            if (y === 0) {
                m.set(hash(x, y), (x * 16807 + depth) % 20183)
                continue;
            }
            if (x === 0) {
                m.set(hash(x, y), (y * 48271 + depth) % 20183)
                continue;
            }
            if (!m.has(hash(x, y - 1)) || !m.has(hash(x - 1, y))) {
                console.log('Very wrong');
                return;
            }
            let geoIndex = m.get(hash(x - 1, y)) * m.get(hash(x, y - 1));
            m.set(hash(x, y), (geoIndex + depth) % 20183);
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const currentRisk = m.get(hash(x, y)) % 3;
            m.set(hash(x, y), currentRisk);
        }
    }
    // [rocky, wet, narrow]
    // [N, T, C]
    let tool = 1;
    let start = [0, 0, 0, tool];

    let heap = [start]; // Lol, "heap"
    let dxDy = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    // <hash(x, y, tool), time spent>
    let timeMap = new Map();
    while (heap.length > 0) {
        let [min, x, y, tool] = heap.shift();
        let bestTime = timeMap.get(hash(x, y, tool)) || Number.MAX_SAFE_INTEGER;
        if (bestTime <= min) {
            continue;
        }
        if (targetX === x && targetY === y && tool === 1) {
            console.log('Minimum', min);
            return;
        }
        timeMap.set(hash(x, y, tool), min);
        for (let i = 0; i < 3; i++) {
            if (i !== tool && i !== m.get(hash(x, y))) {
                let bt = timeMap.get(hash(x, y, i)) || Number.MAX_SAFE_INTEGER;
                if (bt > min + 7) {
                    heap.push([min + 7, x, y, i]);
                }
            }
        }

        for (let [dx, dy] of dxDy) {
            if (x + dx < 0 || x + dx >= width || y + dy < 0 || y + dy >= height) {
                continue;
            }

            let terrain = m.get(hash(x + dx, y + dy));
            if (terrain === tool) {
                // can't got there
                continue;
            }
            let bt = timeMap.get(hash(x + dx, y + dy, tool)) || Number.MAX_SAFE_INTEGER;
            if (bt > min + 1) {
                heap.push([min + 1, x + dx, y + dy, tool]);
            }
        }

        heap.sort((a, b) => {
            let [minA, , ,] = a;
            let [minB, , ,] = b;
            return minA - minB;
        });

        let temp = new Map();
        for (let [min, x, y, t] of heap) {
            if (!temp.get(hash(x, y, t))) {
                temp.set(hash(x, y, t), min);
            }
        }

        heap = []
        for (let [key, v] of [...temp.entries()]) {
            let t = key % 10;
            key = Math.floor(key / 10);
            let y = key % Y_LENGTH;
            let x = Math.floor(key / Y_LENGTH);
            heap.push([v, x, y, t])
        }
    }
}

main();