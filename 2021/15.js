const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');

let min = 0;

const dfs = (cache, x, y, risk, map) => {
    const nRows = map.length;
    const nColumns = map[0].length;

    if (x < 0 || x >= nRows || y < 0 || y >= nColumns) {
        return min;
    }

    risk += map[x][y];
    if (risk >= min) {
        return min;
    }

    if (cache[x][y] < risk) {
        // console.log(cache[x][y]);
        return min;
    }
    cache[x][y] = risk;

    if ((x === nRows - 1) && (y === nColumns - 1)) {
        console.log('done', risk)
        min = Math.min(min, risk);
        return risk;
    }

    let res = [
        dfs(cache, x, y + 1, risk, map),
        dfs(cache, x, y - 1, risk, map),
        dfs(cache, x + 1, y, risk, map),
        dfs(cache, x - 1, y, risk, map),
    ];
    // console.log(x, y)

    return Math.min(...res);
}

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
    }
    const nRows = map.length;
    const nColumns = map[0].length;

    // create a valid path, all the way down and over 
    min = 0;
    for (const row of map) {
        min += row[0];
    }
    for (let i = 1; i < nColumns; i++) {
        min += map[nRows - 1][i];
    }
    console.log(min);


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

            if (currentRisk > min) {
                continue;
            }
            if (cache[x][y] && (cache[x][y] <= currentRisk)) {
                // console.log(cache[x][y], currentRisk)
                continue;
            }
            cache[x][y] = currentRisk;

            if ((x === nRows - 1) && (y === nColumns - 1)) {
                // console.log('done', currentRisk)
                min = Math.min(min, currentRisk);
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
