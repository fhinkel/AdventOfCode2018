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

    let data = [];

    for await (const line of rl) {
        // 0,9 -> 5,9
        data.push(...(line.split(',').map(Number)));
    }

    const min = Math.min(...data);
    const max = Math.max(...data);

    data.sort((a, b) => a - b);

    const l = data.length;

    const average = Math.floor(data.reduce((a, b) => a + b) / l);

    const maxDiff = Math.max(...data.map(n => Math.abs(n - average)));

    let cost = 0;
    for (const pos of data) {
        const diff = Math.abs(pos - average);
        cost += diff*(diff+1)/2;

    }

    console.log(average, cost);


    // fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
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
