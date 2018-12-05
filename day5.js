const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input5.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let minifyInput = (s) => {
    let reacted = [];
    let i = 0;
    while (i < s.length - 1) {
        let left = s[i];
        let right = s[i + 1];
        if ((left !== right) && (left.toUpperCase() === right.toUpperCase())) {
            // console.log(`Delete ${s[i]} at ${i}`);
            reacted.push(i);
            i++;
        }
        i++
    }


    console.log(`These need to be deleted: ${reacted}`);
    for (let i = reacted.length - 1; i >= 0; i--) {
        // delete i-1 and i
        let leftString = s.slice(0, reacted[i]);
        let rightString = s.slice(reacted[i] + 2)
        console.log(`${reacted[i]}: ${leftString} and ${rightString}`)
        s = leftString + rightString;
    }

    return s;

}



let main = async () => {
    let inputs = await readInput();
    console.log(inputs[0]);
    let res = minifyInput(inputs[0]);
    console.log(res);

}

main();