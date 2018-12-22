const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input22.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let hash = (x, y) => x * 1000 + y;


let main = async () => {
    // depth: 510
    // target: 10,10
    let inputs = await readInput();
    let [, depth] = (inputs[0]).split(' ').map(Number);
    let target = (inputs[1].split(' '))[1];
    let [targetX, targetY] = target.split(',').map(Number);
    let height = targetY + 1;
    let width = targetX + 1;

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

    let riskLevel = 0;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            riskLevel += m.get(hash(x, y)) % 3;
        }
    }
    // console.log(m)

    // console.log(m.get(hash(0, 1)))
    // console.log(m.get(hash(1, 0)))
    // console.log(m.get(hash(1, 1)))

    console.log(riskLevel);
}

main();