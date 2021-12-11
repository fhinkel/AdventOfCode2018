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
    let count = 0;

    const findBasin = (lowPoint, basins) => {
        const [j, i] = lowPoint;

        basins[j][i] = 'x'
        if (i > 0) {
            if (data[j][i - 1] > data[j][i] && data[j][i - 1] !== 9 && basins[j][i - 1] !== 'x') {
                basins[j][i - 1] = 'x'
                findBasin([j, i - 1], basins);
            }
        }

        if (i + 1 < data[0].length) {
            if (data[j][i + 1] > data[j][i] && data[j][i + 1] !== 9 && basins[j][i + 1] !== 'x') {
                basins[j][i + 1] = 'x'
                findBasin([j, i + 1], basins);
            }
        }

        if (j > 0) {
            if (data[j - 1][i] > data[j][i] && data[j - 1][i] !== 9 && basins[j - 1][i] !== 'x') {
                basins[j - 1][i] = 'x'
                findBasin([j - 1, i], basins);
            }
        }

        if (j + 1 < data.length) {
            if (data[j + 1][i] > data[j][i] && data[j + 1][i] !== 9 && basins[j + 1][i] !== 'x') {
                basins[j + 1][i] = 'x'
                findBasin([j + 1, i], basins);
            }
        }
    }

    let sizes = [];
    for (let j = 0; j < data.length; j++) { // up-down
        for (let i = 0; i < data[0].length; i++) { // left-right
            let p = data[j][i];
            const left = (i == 0) || data[j][i - 1] > p;
            const right = (i + 1 === data[0].length) || data[j][i + 1] > p;
            const up = (j == 0) || data[j - 1][i] > p;
            const down = (j + 1 === data.length) || data[j + 1][i] > p;
            if (left && right && up && down) {
                risk += p + 1;
                count++;

                let basins = Array(data.length).fill().map(x => []);
                findBasin([j, i], basins);
                let size = basins.flat().filter(x => x === 'x').length;
                // console.log(`size for ${i},${j} is ${size}`);
                sizes.push(size);
            }
        }
    }

    sizes.sort((a,b)=> a-b);

    console.log(sizes.pop() * sizes.pop() * sizes.pop());


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
