const fs = require('fs');

let readInput = (): number[][] => {
    let res: string = fs.readFileSync('./input.txt').toString();
    return res.split('\n')
        .map((line: string) => line.split(/\s+/).map(Number));
}

let findDist = (inputs: number[][]): number => {
    // input array of 2 number pairs
    let first: number[] = [];
    let second: number[] = [];
    for (const [f, s] of inputs) {
        first.push(f)
        second.push(s)
    }

    first.sort((a: number, b: number) => a - b)
    second.sort((a: number, b: number) => a - b)

    let sum: number = 0;
    for (let i = 0; i < first.length; i++) {
        sum += Math.abs(first[i] - second[i])
    }

    return sum
}

const findSim = (inputs: number[][]): number => {
    const first: number[] = [];
    const second: number[] = [];
    for (const [f, s] of inputs) {
        first.push(f)
        second.push(s)
    }

    const m: Map<number, number> = new Map();
    for (const num of second) {
        if (!m.has(num)) {
            m.set(num, 1)
        } else {
            m.set(num, m.get(num)! + 1)
        }
    }

    let sum: number = 0
    for (const num of first) {
        if (m.has(num)) {
            sum += num * m.get(num)!
        }
    }
    return sum
}

let main = () => {
    let inputs: number[][] = readInput();
    let sum: number = findDist(inputs);
    let simDist: number = findSim(inputs);
    console.log("sim Score: " + simDist);
    console.log(sum);
}

main();
