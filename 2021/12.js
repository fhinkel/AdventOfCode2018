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
        add(a, b, connections);
        add(b, a, connections);
    }

    let count = 0;
    const queue = [['start']];
    while (queue.length !== 0) {
        let path = queue.pop();
        let last = path[path.length - 1];
        if (last === 'end') {
            count++;
            continue;
        }
        for (const dest of connections.get(last)) {
            if (mayVisit(dest, path)) {
                queue.push([...path, dest]);
            }
        }
    }

    console.log(count);
}

const mayVisit = (dest, path) => {
    if (!isLower(dest)) {
        return true;
    }
    return !path.includes(dest);
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
