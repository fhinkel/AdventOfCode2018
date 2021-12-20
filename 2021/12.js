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


    let connections = [];
    for await (const line of rl) {
        connections.push(line.split('-'));
    }

    // console.log(connections);

    console.log(runPath('start', connections));
}

const runPath = (src, connections) => {
    if (src === 'end') return 1;
    let count = 0;
    for (const [a, b] of connections) {
        if (a !== src) continue;
        if (a.toLowerCase() === a) {
            const fewerConnections = [];
            for (const [src, dest] of connections) {
                if (src === a || dest === a) continue;
                fewerConnections.push([src, dest]);
            }
            count += runPath(b, fewerConnections);
        }

    }
    return count;
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
