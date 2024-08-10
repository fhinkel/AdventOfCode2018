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

    let sum = 0;


    for await (const line of rl) {
        const cubes = new Map([
            ['red', 0],
            ['green', 0],
            ['blue', 0],
        ]);
        var [, numbers] = line.split(':');

        const rounds = numbers.split(';');

        let power = 1;
        for (const round of rounds) {
            const entries = round.split(',').map(x => x.trim());
            for (const entry of entries) {
                const [num, color] = entry.split(' ');
                if (cubes.get(color) < parseInt(num)) {
                    cubes.set(color, parseInt(num));
                }
            }
        }
        cubes.forEach((num, color) => {
            power *= parseInt(num);
        });
        cubes.set('red', 0);
        cubes.set('green', 0);
        cubes.set('blue', 0);
        sum += power;

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
