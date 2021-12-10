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
        data.push(line.split('').map(Number));
    }

    // console.log(data);
    let risk = 0;

    for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < data[0].length; i++) {
            let p = data[j][i];
            const left = (i == 0) || data[j][i - 1] > p;
            const right = (i + 1 === data[0].length) || data[j][i + 1] > p;
            const up = (j == 0) || data[j - 1][i] > p;
            const down = (j + 1 === data.length) || data[j + 1][i] > p;
            if (left && right && up && down) {
                risk += p + 1;
            }
        }
    }

    console.log(risk);



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
