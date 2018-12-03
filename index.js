const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input3.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    // console.log(inputs);
    return inputs
}

let distance = (s1, s2) => {
    let d = 0;
    for (let i = 0; i < s1.length; i++) {
        if (s1[i] !== s2[i]) {
            d++;
            if (d > 1) {
                return d;
            }
        }
    }

    return d;
}

let findMultiples = (s) => {
    let m = new Map();
    for (let c of s.split('')) {
        m.set(c, 1 + (m.get(c) || 0));
    }
    const counts = [...m.values()];
    return [counts.includes(2), counts.includes(3)];
}

let overlap = async (inputs) => {
    let fabric = [];
    for (let i = 0; i < 1000; i++) {
        fabric[i] = [];
    }
    for (let input of inputs) {
        // #1 @ 1,3: 4x4
        let [, , start, square] = input.split(' ');
        let [left, top] = start.slice(0, -1).split(',').map(Number);
        let [width, height] = square.split('x').map(Number);

        for (let w = 0; w < width; w++) {
            for (let h = 0; h < height; h++) {
                fabric[w + left][h + top] = 1 + (fabric[w + left][h + top] || 0);
            }
        }
    }

    let overlap = 0;
    for (let w = 0; w < 1000; w++) {
        for (let h = 0; h < 1000; h++) {
            if (fabric[w][h] > 1) {
                overlap++;
            }
        }
    }
    return overlap;
}

let main = async () => {
    let inputs = await readInput();

    let res = await overlap(inputs);
    console.log(res);
}

main();