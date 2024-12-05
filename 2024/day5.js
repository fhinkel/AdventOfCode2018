const { UV_UDP_REUSEADDR } = require('constants');
const fs = require('fs');

let readInput = () => {
    // let res = fs.readFileSync('./input.txt');
    let res =  fs.readFileSync('./test-input.txt');
    res = res.toString().split('\n').map(line => line.trim())
    const index = res.indexOf("")
    const orders = res.slice(0, index)
    const updates = res.slice(index+1)
    return [orders, updates];
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