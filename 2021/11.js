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
            const energy = octopuses[i][j];
            octopuses[i][j] = {energy, flashed: false};
        }
    }

    const n = octopuses.length;
    let flashes = 0;

    for (let s = 0; s < STEPS; s++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                octopuses[i][j].energy++;
            }
        }
        while (octopuses.flat().some(o => o.energy > 9 && !o.flashed)) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (octopuses[i][j].energy > 9 && !octopuses[i][j].flashed) {
                        octopuses[i][j].flashed = true;
                        flashes++;
                        flashNeighbors(i, j, octopuses);
                    }
                }
            }
        }

        if (octopuses.flat().every(o => o.flashed)) {
            console.log(`Synchronized after ${s + 1} steps`);
            break;
        }

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (octopuses[i][j].flashed) {
                    octopuses[i][j].energy = 0;
                    octopuses[i][j].flashed = false;

                }
            }
        }
    }
}

const update = (i, j, octopuses) => {
    const n = octopuses.length;
    if (i >= 0 && i < n && j >= 0 && j < n) {
        octopuses[i][j].energy++;
    }
}

const flashNeighbors = (i, j, octopuses) => {
    update(i - 1, j - 1, octopuses);
    update(i - 1, j, octopuses);
    update(i - 1, j + 1, octopuses);

    update(i, j - 1, octopuses);
    update(i, j + 1, octopuses);

    update(i + 1, j - 1, octopuses);
    update(i + 1, j, octopuses);
    update(i + 1, j + 1, octopuses);
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
