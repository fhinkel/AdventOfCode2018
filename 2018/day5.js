const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input5.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let minifyInput = (s) => {
    return s.reduce((acc, v) => 
        (acc.length > 0 && acc[acc.length - 1] !== v && acc[acc.length - 1].toLowerCase() === v.toLowerCase()) ?
            acc.slice(0, -1) : [...acc, v]
       );
}



let main = async () => {
    let inputs = await readInput();
    let s = inputs[0]
    let min = Number.MAX_VALUE;
    let chars = 'abcdefghijklmnopqrstuvwxyz';


    for (let char of chars.split('')) {
        let withoutC = s.split('').filter(c => (c.toLowerCase() !== char));
        min = Math.min(min, minifyInput(withoutC).length);
    }

    console.log(min);

}

main();