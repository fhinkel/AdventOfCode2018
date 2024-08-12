const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');
const { parse } = require('path');

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    const starsMapKey = (line, index) => line * 10000 + index;

    // 467..114..
    // ...*......
    let lineNum = 0;
    let starsMap = new Map();
    const numsMap = new Map();
    for await (let line of rl) {
        line = line.split('');
        for (let i = 0; i < line.length; i++) {
            if (!isNaN(parseInt(line[i]))) {
                let num = "";
                while (!isNaN(parseInt(line[i]))) {
                    num += line[i];
                    i++;
                }
                numsMap.set([lineNum, i - num.length], parseInt(num));
                i--;
            } else if (line[i] === '.') {
                // do nothing
            }
            else {
                // Symbol
                starsMap.set(starsMapKey(lineNum, i), '*');
            }

        }
        lineNum++;
    }

    let sum = 0;

    let adjacentToSymbol = (line, index, starsMap) => {
        let adjacent = [
            [line - 1, index - 1],
            [line - 1, index],
            [line - 1, index + 1],
            [line, index - 1],
            [line, index + 1],
            [line + 1, index - 1],
            [line + 1, index],
            [line + 1, index + 1],
        ];
        for (let [line, index] of adjacent) {
            if (starsMap.has(starsMapKey(line, index))) {
                return true;
            }
        }

    }

    for (let [key, value] of numsMap) {
        let [line, index] = key;
        for (let i = 0; i < String(value).length; i++) {
            if (adjacentToSymbol(line, index + i, starsMap)) {
                sum += value;
                break;
            }
        }
    }

    console.log(sum);

    // fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
}

const main = async () => {
    // console.log('start')
    const path = '.';
    try {
        const files = glob.sync(`${path}/2023/1.txt`, {
            ignore: ['node_modules'],
        });
        for (const file of files) {
            console.log("file " + file);
            const stat = statSync(file);
            if (!stat.isFile()) continue;
            processLineByLine(file);
        }
    } catch (err) {
        console.error(err);
    }
};

main();
