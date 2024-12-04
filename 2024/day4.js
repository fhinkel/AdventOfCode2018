const { watchFile } = require('fs');

const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input.txt');
    // let res = await fs.readFile('./test-input.txt');
    res = res.toString().split('\n').map(line => line.trim())
    return res;
}

const countWords = (lines) => {
    // XMAS
    let count = 0
    for (const line of lines) {
        // left to right
        let ms = line.matchAll(/XMAS/g);
        for (const m of ms) {
            count++
        }

        // right to left
        ms = line.matchAll(/SAMX/g);
        for (const m of ms) {
            count++
        }
    }

    // top to bottom
    const n = lines.length;
    const m = lines[0].length;
    for (let i = 0; i < n - 3; i++) {
        let matches = [...lines[i].matchAll(/X/g)].map(m => m.index);
        for (const index of matches) {
            if (lines[i + 1][index] === 'M' && lines[i + 2][index] === 'A' && lines[i + 3][index] === 'S') {
                count++
            }
        }
    }

    // bottom to top
    for (let i = 0; i < n - 3; i++) {
        let matches = [...lines[i].matchAll(/S/g)].map(m => m.index);
        for (const index of matches) {
            if (lines[i + 1][index] === 'A' && lines[i + 2][index] === 'M' && lines[i + 3][index] === 'X') {
                count++
            }
        }
    }

    // upper left to lower right diagonal
    for (let i = 0; i < n - 3; i++) {
        let matches = [...lines[i].matchAll(/X/g)].map(m => m.index);
        for (const index of matches) {
            if (index >= m - 3) continue
            if (lines[i + 1][index + 1] === 'M' && lines[i + 2][index + 2] === 'A' && lines[i + 3][index + 3] === 'S') {
                count++
            }
        }
    }

    // lower right  to upper left diagonal
    for (let i = 0; i < n - 3; i++) {
        let matches = [...lines[i].matchAll(/S/g)].map(m => m.index);
        for (const index of matches) {
            if (index >= m - 3) continue
            if (lines[i + 1][index + 1] === 'A' && lines[i + 2][index + 2] === 'M' && lines[i + 3][index + 3] === 'X') {
                count++
            }
        }
    }

    // upper right to lower left diagonal
    for (let i = 0; i < n - 3; i++) {
        let matches = [...lines[i].matchAll(/X/g)].map(m => m.index);
        for (const index of matches) {
            if (index < 3) continue
            if (lines[i + 1][index - 1] === 'M' && lines[i + 2][index - 2] === 'A' && lines[i + 3][index - 3] === 'S') {
                count++
            }
        }
    }

    //  lower left to upper right diagonal
    for (let i = 0; i < n - 3; i++) {
        let matches = [...lines[i].matchAll(/S/g)].map(m => m.index);
        for (const index of matches) {
            if (index < 3) continue
            if (lines[i + 1][index - 1] === 'A' && lines[i + 2][index - 2] === 'M' && lines[i + 3][index - 3] === 'X') {
                count++
            }
        }
    }

    return count

}

let main = async () => {
    let inputs = await readInput();
    let sum = countWords(inputs);
    console.log(sum);
}

main();