const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async() => {
    let res = await fs.readFile('./input.txt');
    let inputs = res.toString().split('\n');
    console.log(inputs);
    return inputs
}

let findFrequency = async (inputs) => {
    let frequencies = new Set();
    let f = 0;
    let i = 0;
    console.log(`Roundf ${i++} with set size ${frequencies.size}`);

    for(let input of inputs) {
        f = f + Number(input);
        if(frequencies.has(f)) {
            return f;
        }
        frequencies.add(f);
    }

    console.log(f);

    while (true) {
        console.log(`Round ${i++} with set size ${frequencies.size}`);

        for(let input of inputs) {
            f = f + Number(input);
            if(frequencies.has(f)) {
                return f;
            }
            frequencies.add(f);
        }
    }
} 

let main = async() => {
    let inputs = await readInput();

    // inputs = [+7, +7, -2, -7, -4];
    let f = await findFrequency(inputs);
    console.log(f);
}

main();