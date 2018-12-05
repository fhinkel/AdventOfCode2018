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

    console.log(minifyInput(inputs[0]).length);

}

main();