const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');

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

    // extend map times 5 in both directions
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

    let q = [[0, 0, 0]];
    while (q.length > 0) {
        while (q.length > 0) {
            // A* algorithm: gScore + Manhattan distance as heuristic
            q = q.sort((a,b)=> (b[2]-b[0]-b[1])-(a[2]-a[0]-a[1]));
            const [x, y, risk] = q.pop();
            if (x < 0 || x >= nRows || y < 0 || y >= nColumns) {
                continue;
            }

            let currentRisk = risk + map[x][y];

            if (cache[x][y] && (cache[x][y] <= currentRisk)) {
                continue;
            }
            cache[x][y] = currentRisk;

            if ((x === nRows - 1) && (y === nColumns - 1)) {
                continue;
            }

            q.push(
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
