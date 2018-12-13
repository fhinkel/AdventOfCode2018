const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input12.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs
}

let nextGeneration = (initialState, rules) => {
    initialState = '..' + initialState + '....';
    next = '';

    for (let i = 2; i < initialState.length - 2; i++) {
        let substr = initialState.slice(i - 2, i + 3);
        let pot = rules.get(substr) || '.';
        // console.log(`${substr}: ${pot}`);
        next += pot;
    }
    return next;
}

let main = async () => {
    ``
    let inputs = (await readInput());
    //     initial state: #..#.#..##......###...###
    //
    // ...## => #
    // ..#.. => #
    let initialState;
    // <pattern, next>
    let rules = new Map();
    for (let line of inputs) {
        if (line.match(/initial state/)) {
            initialState = line.split(' ')[2];
            continue;
        }
        let [old, , next] = line.split(' ');
        rules.set(old, next || '.');
    }

    let left = 0;
    let padding = '';
    for (let i = 0; i < 2 * 20; i++) {
        padding += '.';
    }
    console.log(initialState.lenght);
    let marker = '';
    for (let i = 0; i < (initialState + padding).length; i++) {
        let s = ((i % 10) + 10) % 10;
        marker = marker + s;
    }
    console.log(marker);
    initialState = '.' + initialState;
    let next = initialState;
    console.log(initialState + padding);
    for (let i = 0; i < 20; i++) {
        left -= 2;
        next = nextGeneration(next, rules);
        padding = padding.slice(0, padding.length - 2);
        console.log(next);
        if (initialState === next) {
            console.log(`We got stability ${i}`);
        }
        // console.log( next + padding);
    }

    let sum = 0;
    let index = -1;
    for (let i = 0; i < next.length; i++) {

        if (next[i] === '#') {
            sum += index;
        }
        index++;
    }

    console.log(sum)

    // after 200 iterations, sum is 11891

    let FIVE_BILLION = 5000000000;
}

main();