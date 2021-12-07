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
    // ('\r\n') in input.txt as a single line break.

    const data = [];

    for await (const line of rl) {
        // 0,9 -> 5,9
        let [source, target] = line.split(" -> ").map(e => e.trim());
        data.push([source.split(',').map(Number), target.split(',').map(Number)]);
    }

    let max = Math.max(...data.map(([[x1, y1], [x2, y2]]) => Math.max(x1, x2, y1, y2)));

    let map = [];
    for (let i = 0; i <= max; i++) {
        map[i] = [];
        for (let j = 0; j <= max; j++) {
            map[i][j] = 0;
        }
    }

    // console.log(max);

    for (const [[x1, y1], [x2, y2]] of data) {
        if (x1 === x2) {
            for (let i = Math.min(y1, y2); i <= Math.max(y1, y2); i++) {
                map[x1][i] = map[x1][i] + 1;
            }

        } else if (y1 === y2) {
            for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
                map[i][y1] = map[i][y1] + 1;
            }
        } else {
            if (Math.abs(x1 - x2) !== Math.abs(y1 - y2)) {
                console.log('Not diagonal');
                console.log(x1, x2, y1, y2);
            }
            let dir = [];
            if (x1 < x2) {
                dir[0] = +1;
            } else {
                dir[0] = -1;
            }

            if (y1 < y2) {
                dir[1] = +1;
            } else {
                dir[1] = -1;
            }
            for (let i = 0; i <= Math.abs(x1 - x2); i++) {
                map[x1 + (dir[0] * i)][y1 + (dir[1] * i)] = map[x1 + (dir[0] * i)][y1 + (dir[1] * i)] + 1;
            }
        }
    }

    let count = 0;

    for (let i = 0; i <= max; i++) {
        for (let j = 0; j <= max; j++) {
            if (map[i][j] >= 2) {
                count++;
            }
        }
    }

    console.log(count);

    // fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
}



const main = async () => {
    const path = '.';
    try {
        const files = glob.sync(`${path}/*.txt`, {
            ignore: ['node_modules'],
        });
        for (const file of files) {
            console.log(file);
            const stat = statSync(file);
            if (!stat.isFile()) continue;
            processLineByLine(file);
        }
    } catch (err) {
        console.error(err);
    }
};

main();
