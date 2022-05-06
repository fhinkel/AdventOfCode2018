const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');

const isLower = (a) => a === a.toLowerCase();

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break

    let add = (a, b, connections) => {
        if (!connections.has(a)) {
            connections.set(a, []);
        }
        connections.get(a).push(b)
    }

    let connections = new Map();
    for await (const line of rl) {
        const [a, b] = line.split('-');
        if (b !== 'start') add(a, b, connections);
        if (a !== 'start') add(b, a, connections);
    }

    let count = 0;

    const startPath = { p: ['start'], double: '' };
    const queue = [startPath];
    while (queue.length !== 0) {
        let path = queue.pop();
        let last = path.p[path.p.length - 1];
        if (last === 'end') {
            // console.log(path.p.join(', '));
            count++;
            continue;
        }
        for (const dest of connections.get(last)) {
            const [visit, double] = mayVisit(dest, path);
            if (visit) {
                const newPath = {};
                newPath.p = [...path.p, dest];
                newPath.double = double || path.double;
                queue.push(newPath);
            }
        }
    }

    console.log(count);
}

// returns [mayVisit, hasDouble]
const mayVisit = (dest, path) => {
    if (!isLower(dest)) {
        return [true, path.double];
    }
    if (!path.p.includes(dest)) {
        return [true, path.double]
    }
    if (!path.double) {
        return [true, dest];
    };
    return [false, path.double];
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
