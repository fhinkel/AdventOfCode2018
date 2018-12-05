const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input5.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let minifyInput = (s) => {

    let stack = [];
    for (let i = 0; i < s.length; i++) {
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
    let min = Number.MAX_VALUE;
    let chars = 'abcdefghijklmnopqrstuvwxyz';

    for (let char of chars.split('')) {
        let withoutC = s.split('').filter(c => (c.toLowerCase() !== char));
        min = Math.min(min, minifyInput(withoutC).length);
    }

    console.log(min);

}

main();