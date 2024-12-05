const fs = require('fs');

let readInput = () => {
    let res = fs.readFileSync('./input.txt');
    // let res =  fs.readFileSync('./test-input.txt');
    res = res.toString().split('\n').map(line => line.trim())
    return res;
}

const countWords = (lines) => {
    // MAS
    let count = 0

    // top to bottom
    const n = lines.length;
    const m = lines[0].length;
    for (let i = 0; i < n - 2; i++) {
        const matches = [...lines[i].matchAll(/M/g)].map(m => m.index);
        for (const index of matches) {
            if (index >= m - 2) continue
            if (lines[i + 1][index + 1] === 'A' && lines[i + 2][index + 2] === 'S') {
                // M   M
                //   A
                // S   S
                if (lines[i][index + 2] === 'M' && lines[i + 2][index] === 'S') {
                    count++
                    // M   S
                    //   A
                    // M   S
                } else if (lines[i][index + 2] === 'S' && lines[i + 2][index] === 'M') {
                    count++
                }
            }
        }
    }

    for (let i = 0; i < n - 2; i++) {
        const matches = [...lines[i].matchAll(/S/g)].map(m => m.index);
        for (const index of matches) {
            if (index >= m - 2) continue
            if (lines[i + 1][index + 1] === 'A' && lines[i + 2][index + 2] === 'M') {
                // S   M
                //   A
                // S   M
                if (lines[i][index + 2] === 'M' && lines[i + 2][index] === 'S') {
                    count++
                    // S   S
                    //   A
                    // M   M
                } else if (lines[i][index + 2] === 'S' && lines[i + 2][index] === 'M') {
                    count++
                }
            }
        }
    }
    return count
}

let main = () => {
    let inputs = readInput();
    let sum = countWords(inputs);
    console.log(sum);
}

main();