const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input8.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let sumMeta = (inputs, index, sum) => {
    if (index + 2 >= inputs.length) {
        return;
    }
    let [n, m] = [inputs[index], inputs[index + 1]];
    let l = 2;
    let nodeValues = [];
    for(let i =0; i < n; i++ ){
        let [value, nodeValue] = sumMeta(inputs, l+index, sum);
        l += value;
        nodeValues.push(nodeValue);
    }
    let value = 0;
    let s = inputs.slice(l+index, l + index + m).reduce((acc, v) => {
        if(v !== 0 && v <=n) {
            // valid child reference
            value += nodeValues[v-1];
        }
        return acc + v
    }, 0);

    if(n === 0) {
        value += s;
    } 
    sum.sum += s;
    return [m + l, value];
}

let main = async () => {
    let inputs = (await readInput())[0];
    inputs = inputs.split(' ').map(Number);
    let sum = { sum: 0 };
    let [, value] = sumMeta(inputs, 0, sum);
    console.log(value);
}

main();