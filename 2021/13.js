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
            dots.push([x, y]);
        }
        if (line.includes('fold')) {
            let [direction, n] = line.split('=');
            direction = direction[direction.length - 1];
            folds.push([direction, Number(n)]);
        }
    }

    const n = folds[0][1];
    let newDots = [];
    if (folds[0][0] === 'y') {
        for (const [x, y] of dots) {
            if (y < n) {
                newDots.push([x, y]);
            } else {
                const dist = y - n;
                newDots.push([x, y - dist * 2]);
            }
        }
    }

    if (folds[0][0] === 'x') {
        for (const [x, y] of dots) {
            if (x < n) {
                newDots.push([x, y]);
            } else {
                const dist = x - n;
                newDots.push([x - dist * 2, y]);
            }
        }
    }

    newDots = newDots.map(a => a.join(','));
    let s = new Set(newDots);
    console.log(s.size);




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
