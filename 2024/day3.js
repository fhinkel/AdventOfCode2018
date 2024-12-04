const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input.txt');
    // let res = await fs.readFile('./test-input.txt');
    res = res.toString(); //.split('\n')
    return res;
}

const addProducts = (s) => {
    const regex = /mul\(\d{1,3},\d{1,3}\)/g;
    // xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
    let indexes = s.matchAll(regex);

    let sum = 0
    for(const index of indexes) {
        const arg = index[0];
        const [a,b] = arg.match(/\d+/g)
        sum += Number(a) * Number(b)
    }
    return sum
}

let main = async () => {
    let inputs = await readInput();
    let sum = addProducts(inputs);
    console.log(sum);
}

main();