const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');
const { count } = require('console');

const isLower = (a) => a === a.toLowerCase();

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break

    const dots = [];
    const folds = [];
    for await (const line of rl) {
        if (line.includes(',')) {
            let [x, y] = line.split(',').map(n => Number(n));
            dots.push([x,y]);
        }
        if(line.includes('fold')) {
            console.log(line);
            let [direction, n] = line.split('=');
            direction = direction[direction.length - 1];
            folds.push([direction, n]);
        }
    }
    // console.log(dots);
    console.log(folds[0]);
}


const main = async () => {
    const path = '.';
    try {
        const files = glob.sync(`${path}/13.txt`, {
            ignore: ['node_modules'],
        });
        for (const file of files) {
            const stat = statSync(file);
            if (!stat.isFile()) continue;
            processLineByLine(file);
        }
    } catch (err) {
        console.error(err);
    }
};

main();
