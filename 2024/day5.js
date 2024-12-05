const fs = require('fs');

let readInput = () => {
    let res = fs.readFileSync('./input.txt');
    // let res =  fs.readFileSync('./test-input.txt');
    res = res.toString().split('\n').map(line => line.trim())
    return res;
}

const countWords = (lines) => {
    return 0
}

let main = () => {
    let inputs = readInput();
    let sum = countWords(inputs);
    console.log(sum);
}

main();