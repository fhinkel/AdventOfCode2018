const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input.txt');
    res = res.toString().split('\n')
        .map(line => line.split(/\s+/).map(Number));
    return res;

}

let findDist = async (inputs) => {
    // input array of 2 number pairs
    let first = [];
    let second = [];
    for (const [f, s] of inputs) {
        first.push(f)
        second.push(s)
    }

    first.sort((a, b) => a - b)
    second.sort((a, b) => a - b)

    let sum = 0;
    for (let i = 0; i < first.length; i++) {
        sum += Math.abs(first[i] - second[i])
    }

    return sum
}

const findSim = (inputs) => {
    const first = [];
    const second = [];
    for (const [f, s] of inputs) {
        first.push(f)
        second.push(s)
    }

    const m = new Map();
    for (const num of second) {
        if (!m.has(num)) {
            m.set(num, 1)
        } else {
            m.set(num, m.get(num) + 1)
        }
    }

    let sum = 0
    for(const num of first) {
        if(m.has(num)) {
            sum += num * m.get(num)
        }
    }
    return sum
}

let main = async () => {
    let inputs = await readInput();
    let sum = await findDist(inputs);
    let simDist = await findSim(inputs);
    console.log("sim Score: " + simDist);
    console.log(sum);
}

main();