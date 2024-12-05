const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input.txt');
    // let res = await fs.readFile('./test-input.txt');
    res = res.toString(); //.split('\n')
    return res;
}

const addProducts = (s) => {
    s = 'do()' + s; // always start active
    let segments = s.split("don't()");
    let sum = 0

    for(const segment of segments) {
        let parts = segment.split("do()")
        parts.shift() // get rid of first deactivated instruction
        for(const part of parts) {
            let matches = part.matchAll(/mul\(\d{1,3},\d{1,3}\)/g);
            for (const m of matches) {
                const index = m.index
                // console.log(m, index);
                const [a, b] = m[0].match(/\d+/g)
                sum += Number(a) * Number(b)
            }
        }
    }

    return sum
}

let main = async () => {
    let inputs = await readInput();
    let sum = addProducts(inputs);
    console.log(sum);
}

main();