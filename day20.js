const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input19.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let main = async () => {
    let inputs = await readInput();

    console.log(register[0]);
}

main();