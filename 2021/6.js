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

    let n = 256;

    let newData = [];
    for(let i = 0; i < n; i++) {
        for(const fish of data) { 
            if(fish === 0) {
                newData.push(6);
                newData.push(8);
            } else {
                newData.push(fish - 1);
            }
        }
        // console.log(newData);
        data = [...newData];
        newData = [];
    }

    console.log(data.length);


    // fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
}



const main = async () => {
    const path = '.';
    try {
        const files = glob.sync(`${path}/sample.txt`, {
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
