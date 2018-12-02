const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input2.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    // console.log(inputs);
    return inputs
}

let distance = (s1, s2) => {
    let d = 0;
    for (let i = 0; i < s1.length; i++) {
        if (s1[i] !== s2[i]) {
            d++;
            if (d > 1) {
                return d;
            }
        }
    }

    return d;
}

let findMultiples = (s) => {
    let m = new Map();
    for (let c of s.split('')) {
        m.set(c, 1 + (m.get(c) || 0));
    }
    const counts = [...m.values()];
    return [counts.includes(2), counts.includes(3)];
}

let nearIds = async (inputs) => {
    for (let i = 0; i < inputs.length; i++) {
        for (let j = 1; j < inputs.length; j++) {
            if (distance(inputs[i], inputs[j]) === 1) {
                const s1 = inputs[i];
                const s2 = inputs[j];
                let res = '';
                for (let k = 0; k < s1.length; k++) {
                    if (s1[k] === s2[k]) {
                        res += s1[k];
                    }
                }
                return res;
            }
        }
    }
    return 'No near boxes found.'
}

let main = async () => {
    let inputs = await readInput();

    let f = await nearIds(inputs);
    console.log(f);
}

main();