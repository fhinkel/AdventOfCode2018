const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');
const { count } = require('console');

const isLower = (a) => a === a.toLowerCase();

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break

    let template;
    const rules = new Map();
    for await (const line of rl) {
        if (!line) continue;
        if (line.includes('-')) {
            // rule CH -> B
            let first = line[0];
            let second = line[1];
            let newL = line[6];
            // console.log(first, second, newL);
            rules.set(first + second, newL);
        } else {
            template = line;
        }
    }

    const increase = (m, p, n) => {
        m.set(p, (m.get(p) || 0) + n);
    }

    let pairs = new Map();
    for (let i = 0; i < template.length - 1; i++) {
        const pair = template[i] + template[i + 1];
        increase(pairs, pair, 1);
    }


    for (let i = 0; i < 40; i++) {
        let newPairs = new Map();
        for (const [pair, n] of pairs.entries()) {
            if (rules.has(pair)) {
                const c = rules.get(pair);
                increase(newPairs, pair[0] + c, n);
                increase(newPairs, c + pair[1], n);
            } else {
                increase(newPairs, pair, n);
            }
        }
        pairs = newPairs;
    }

    // Count the letters
    let m = new Map();
    for (const [pair, n] of pairs.entries()) {
        increase(m, pair[0], n);
        increase(m, pair[1], n);
    }
    let counts = [...m.entries()];
    counts = counts.sort(([c1, n1], [c2, n2]) => n1 - n2);
    const diff = counts[counts.length - 1][1] - counts[0][1]
    // Almost every letter is counted twice in beginning and end of pair
    // only first and last letter of the string are not counted twice. 
    // If they are the min or max frequent letter, we need to round differently.
    console.log(diff/2);
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
