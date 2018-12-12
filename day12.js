const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input12.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs
}

let main = async () => {
    let inputs = (await readInput());
    for (let line of inputs) {
       
    }
}

main();