const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input20.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let main = async () => {
    let inputs = await readInput();
    let regex = inputs[0];
    let length = regex.length - 2;
    console.log(length); // 14000
    // Assume 10K x 10K grid
    const DIM = 10000;
    let [x, y] = [DIM / 2, DIM / 2];

    let directions = {
        'E': [1, 0],
        'S': [0, 1],
        'W': [-1, 0],
        'N': [0, -1],
    };

    let stack = [];

    // < hash(x,y), minDistance to starting point>
    let dist = new Map();

    let hash = (x, y) => {
        // [4,67] => 40067
        return x * DIM + y;
    }
    dist.set(hash(x, y), 0);

    for (let i = 1; i < length - 1; i++) {
        const c = regex[i];
        if (c === '(') {
            stack.push([x, y]);
        } else if (c === ')') {
            [x, y] = stack.pop();
        } else if (c === '|') {
            [x, y] = stack[stack.length - 1];
        } else {
            let [dx, dy] = directions[c];
            let [newX, newY] = [x + dx, y + dy];
            let hn = hash(newX, newY);
            let oldDistance = dist.get(hash(x, y));
            if (dist.has(hn)) {
                let min = Math.min(dist.get(hn), oldDistance + 1);
                dist.set(hn, min);
            } else {
                dist.set(hn, oldDistance + 1);
            }

            [x, y] = [newX, newY];
        }
    }
    console.log(Math.max(...dist.values()));  // part 1
    let n = [...dist.values()].filter(v => v >= 1000).length;
    console.log(n); // part 2
}

main();