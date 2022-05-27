const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');

let min = 0;

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break

    let map = [];
    let cache = [];
    for await (const line of rl) {
        map.push(line.split('').map(x => Number(x)));
        cache.push([]);
        cache.push([]);
        cache.push([]);
        cache.push([]);
        cache.push([]);
    }

    let nRows = map.length;
    let nColumns = map[0].length;

    for (let k = 1; k < 5; k++) {
        for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nColumns; j++) {
                let s = map[i][j] + k;
                map[i][j + k * nColumns] = s > 9 ? s % 9 : s;
            }
        }
    }

    nColumns = nColumns * 5;

    for (let k = 1; k < 5; k++) {
        for (let i = 0; i < nRows; i++) {
            map.push([]);
            for (let j = 0; j < nColumns; j++) {
                let s = map[i][j] + k;
                map[i + k * nRows][j] = s > 9 ? s % 9 : s;
            }
        }
    }

    nRows = nRows * 5;

    let q = [];
    let newQ = [[0, 0, 0]];
    while (newQ.length > 0) {
        q = newQ;
        newQ = [];
        // console.log(q.length);
        while (q.length > 0) {
            const [x, y, risk] = q.pop();
            if (x < 0 || x >= nRows || y < 0 || y >= nColumns) {
                continue;
            }

            let currentRisk = risk + map[x][y];

            if (cache[x][y] && (cache[x][y] <= currentRisk)) {
                // console.log(cache[x][y], currentRisk)
                continue;
            }
            cache[x][y] = currentRisk;

            if ((x === nRows - 1) && (y === nColumns - 1)) {
                // console.log('done', currentRisk)
                continue;
            }

            newQ.push(
                [x, y + 1, currentRisk],
                [x, y - 1, currentRisk],
                [x + 1, y, currentRisk],
                [x - 1, y, currentRisk],
            )
        }
    }

    console.log(cache[nRows - 1][nColumns - 1] - map[0][0]);
}

const main = async () => {
    const path = '.';
    try {
        const files = glob.sync(`${path}/sample.txt`, {
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
