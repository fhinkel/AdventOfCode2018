const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input3.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    // console.log(inputs);
    return inputs
}

let overlap = async (inputs) => {
    let validIds = new Set();
    let fabric = [];
    for (let w = 0; w < 1000; w++) {
        fabric[w] = [];
        for (let h = 0; h < 1000; h++) {
            fabric[w][h] = [];
        }
    }
    for (let input of inputs) {
        // #1 @ 1,3: 4x4
        let [id, , start, square] = input.split(' ');
        id = Number(id.substring(1));
        let [left, top] = start.slice(0, -1).split(',').map(Number);
        let [width, height] = square.split('x').map(Number);

        validIds.add(id);
        for (let w = 0; w < width; w++) {
            for (let h = 0; h < height; h++) {
                fabric[w + left][h + top].push(id);
                let square = fabric[w + left][h + top];
                if (square.length > 1) {
                    for(let invalidId of square) {
                        // console.log(`Delete ${invalidId}`);
                        validIds.delete(invalidId);
                    }
                }
            }
        }
    }
    
    // console.log(validIds.values());
    if (validIds.size !==1) {
        console.log('More than one valid Id');
        return;
    }
    return validIds.values().next().value;
}

let main = async () => {
    let inputs = await readInput();

    let res = await overlap(inputs);
    console.log(res);
}

main();