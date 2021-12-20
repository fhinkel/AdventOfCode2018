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


    let octopuses = [];
    for await (const line of rl) {
        octopuses.push(line.split('').map(e => Number(e)));
    }

    let STEPS = 1000;

    for (let i = 0; i < octopuses.length; i++) {
        for (let j = 0; j < octopuses[0].length; j++) {
            // octopus = [ energy, flashed]
            octopuses[i][j] = [octopuses[i][j], false];
        }
    }

    const n = octopuses.length;
    let flashes = 0;

    for (let s = 0; s < STEPS; s++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                octopuses[i][j][0] = octopuses[i][j][0] + 1;
            }
        }
        while (octopuses.flat().some(([energy, flashed]) => energy > 9 && !flashed)) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (octopuses[i][j][0] > 9 && !octopuses[i][j][1]) {
                        octopuses[i][j][1] = true;
                        flashes++;
                        flashNeighbors(i, j, octopuses);
                    }
                }
            }
        }

        if (octopuses.flat().every(([energy, flashed]) => flashed)) {
            console.log(`Synchronized after ${s+1} steps`);
            break;
        }

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (octopuses[i][j][1]) {
                    octopuses[i][j][0] = 0;
                    octopuses[i][j][1] = false;

                }
            }
        }

        // console.log(`After ${s+1} steps`);
        // for (let i = 0; i < n; i++) {
        // console.log(octopuses[i].map(([e,f]) => e).join(''));
        // }
        // console.log();
    }

    // console.log(flashes)
    // console.log(octopuses.flat());
}

const flashNeighbors = (i, j, octopuses) => {
    const n = octopuses.length;
    if (i > 0) {
        if (j > 0) {
            octopuses[i - 1][j - 1][0] = octopuses[i - 1][j - 1][0] + 1;
        }
        octopuses[i - 1][j][0] = octopuses[i - 1][j][0] + 1;
        if (j < n - 1) {
            octopuses[i - 1][j + 1][0] = octopuses[i - 1][j + 1][0] + 1;
        }
    }
    if (j > 0) {
        octopuses[i][j - 1][0] = octopuses[i][j - 1][0] + 1;
    }
    if (j < n - 1) {
        octopuses[i][j + 1][0] = octopuses[i][j + 1][0] + 1;
    }

    if (i < n - 1) {
        if (j > 0) {
            octopuses[i + 1][j - 1][0] = octopuses[i + 1][j - 1][0] + 1;
        }
        octopuses[i + 1][j][0] = octopuses[i + 1][j][0] + 1;
        if (j < n - 1) {
            octopuses[i + 1][j + 1][0] = octopuses[i + 1][j + 1][0] + 1;
        }
    }

}


const main = async () => {
    const path = '.';
    try {
        const files = glob.sync(`${path}/*.txt`, {
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
