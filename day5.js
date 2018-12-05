const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input5.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let minifyInput = (s) => {

    let stack = [];
    stack.push(s[0]);
    for (let i = 1; i < s.length; i++) {
        if (stack.length > 0
            && s[i] !== stack[stack.length - 1]
            && s[i].toLowerCase() === stack[stack.length - 1].toLowerCase()
        ) {
            // cancel each other
            stack.pop();
        } else {
            stack.push(s[i]);
        }
    }

    return stack;

}



let main = async () => {
    let inputs = await readInput();
    let s = inputs[0]
    let min = minifyInput(s).length;
    let chars = 'abcdefghijklmnopqrstuvwxyz';

    for (let char of chars.split('')) {
        min = Math.min(min, minifyInput(s.split('').filter(c => (c.toLowerCase() !== char))).length);
    }

    console.log(min);

}

main();