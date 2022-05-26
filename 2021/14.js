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

    let pairs = new Map();
    for (let i = 0; i < template.length - 1; i++) {
        const pair = template[i] + template[i + 1];
        pairs.set(pair, (pairs.get(pair) || 0) + 1);
    }

    const increase = (m, p, n) => {
        m.set(p, (m.get(p) || 0) + n);
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

    // console.log(template);
    let m = new Map();
    for (const [pair, n] of pairs.entries()) {
        increase(m, pair[0], n);
        increase(m, pair[1], n);
    }
    let counts = [...m.entries()];
    counts = counts.sort(([c1, n1], [c2, n2]) => n1 - n2);
    // console.log(counts);
    const diff = counts[counts.length - 1][1] - counts[0][1]
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
