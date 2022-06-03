const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');


const processLineByLine = async (file) => {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break

    let xMin, xMax, yMin, yMax;
    for await (const line of rl) {
        //target area: x=20..30, y=-10..-5
        let [_, x, y] = line.split('=');
        x = x.split('.');
        xMin = Number(x[0]);
        xMax = Number(x[2].split(',')[0]);
        console.log(xMin, xMax)
        y = y.split('.');
        yMin = Number(y[0]);
        yMax = Number(y[2]);

        console.log(yMin, yMax)
    }

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
