const fs = require('fs').promises;

let readInput = async() => {
    let res = await fs.readFile('./input.txt');
    return res.toString().split('\n').map(Number);
}

let findFrequency = async (inputs) => {
    let frequencies = new Set();
    let f = 0;

    while (true) {
        for(const input of inputs) {
            f += input;
            if(frequencies.has(f)) {
                return f;
            }
            frequencies.add(f);
        }
    }
} 

let main = async() => {
    let inputs = await readInput();
    let f = await findFrequency(inputs);
    console.log(f);
}

main();