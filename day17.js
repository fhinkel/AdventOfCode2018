const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input17.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');

    return inputs;
}



let main = async () => {
    let inputs = (await readInput());

}

main();