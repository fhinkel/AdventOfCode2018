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
    const scores = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4,
    }

    let pairs = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
    }

    let results = [];
    let corrupt = false;
    for await (const line of rl) {
        const s = line.split('');
        let stack = [];
        let res = 0;
        corrupt = false;
        for (const char of s) {
            if (pairs[char]) {
                stack.push(char);
            } else {
                if (char !== pairs[stack.pop()]) {
                    corrupt = true;
                    break;
                }
            }
        }
        if (corrupt) continue;
        while (stack.length !== 0) {
            let char = stack.pop();
            if (pairs[char]) { // opening
                res = res * 5 + scores[pairs[char]];
            }
        }
        results.push(res);
    }
    results.sort((a,b)=>a-b);
    console.log(results[Math.floor(results.length / 2)]);
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
