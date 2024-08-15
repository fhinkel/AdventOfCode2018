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

    for await (let line of rl) {
        // Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11

        let [card, numbers] = line.split(':');
        let [winning, nums] = numbers.split('|');
        winning = winning.trim().split(' ');
        nums = nums.trim().split(' ');
        console.log(nums);
        nums = nums.map(x => parseInt(x)).filter(x => !isNaN(x));
        winning = winning.map(x => parseInt(x)).filter(x => !isNaN(x));

        console.log(winning, nums);
        let val = 0;
        const w = new Set(winning);
        for (let num of nums) {
            if (w.has(num)) {
                if(val === 0) {
                    val = 1;
                }
                else {
                    val *= 2;
                }
            }
        }
        // console.log(val);
        sum += val;

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
