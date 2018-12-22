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
            const currentRisk = m.get(hash(x, y)) % 3;
            riskLevel += currentRisk;
            m.set(hash(x, y), currentRisk);
        }
    }
    console.log(riskLevel);

    let start = [0, 0];
    const tools = ['CT', 'CN', 'TN'];

    let queue = [start];
    let dxDy = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    // <hash(x,y), time spent>
    let timeMap = new Map();
    let tool = 'T';
    console.log(queue)
    while (queue.length !== 0) {
        console.log(queue);
        let [x,y] = queue[queue.length - 1];
        for (let [dx, dy] of dxDy) {
            if(x+dx < 0 || x+dx > targetX || y+dy < 0 || y+dy > targetY) {
                continue;
            }
            let next = [x+dx, y+dy];
            let terrain = m.get(hash(...next));
            if( !m.has(hash(...next))) {
                console.log(`not there: ${x}, ${y} -> ${next}: ${terrain}`);
                return;
            }
            // console.log( hash(...next));
            // console.log(`${x}, ${y} -> ${next}: ${terrain}`)
            let prevTime = timeMap.get(hash(x,y));
            prevTime++;
            if(tools[terrain].split('').indexOf(tool) === -1 ) {
                prevTime += 7;
                let prevTerrain = m.get(hash(x,y));
                if(prevTerrain === 0 && terrain === 1) {
                    tool = 'C'
                } else if(prevTerrain === 0 && terrain === 2) {
                    tool = 'T'
                }else if(prevTerrain === 1 && terrain === 2) {
                    tool = 'N'
                }else if(prevTerrain === 1 && terrain === 0) {
                    tool = 'C'
                } else if(prevTerrain === 2 && terrain === 0) {
                    tool = 'T'
                }else if(prevTerrain === 2 && terrain === 1) {
                    tool = 'N'
                }
            }
            let fastest =  Math.min(prevTime, timeMap.get(hash(...next)) || Number.MAX_SAFE_INTEGER);
            timeMap.set(hash(...next), fastest);
        }
        queue.shift();
    }

    console.log(timeMap.get(hash(targetX, targetY)));
}

main();