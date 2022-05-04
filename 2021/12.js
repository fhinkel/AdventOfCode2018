const fs = require('fs');
const readline = require('readline');

const glob = require('glob');
const { statSync } = require('fs');

const isLower = (a) => a === a.toLocaleLowerCase();

async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break

    let connections = [];
    for await (const line of rl) {
        const [a, b] = line.split('-');
        connections.push([a, b], [b, a]);
        if (isLower(a) && a !== 'start') {
            const aCopy = a + `2`;
            connections.push([aCopy, b], [b, aCopy]);
        }
        if (isLower(b) && b !== 'end') {
            const bCopy = b + `2`;
            connections.push([a, bCopy], [bCopy, a]);
        }

    }

    // console.log(connections);

    console.log(runPath('start', connections, ''));
}

const isSame = (a, b) => {
    if (a === b) return true;
    if ((a + '2') === b) return true;
    if (a === (b + '2')) return true;
    return false;
};

const getOriginal = (a) => {
    if (a.at(-1) === '2') {
        a = a.slice(0, -1);
    }
    return a;
}

const isOriginal = (a) => {
    return a === getOriginal(a);
}

const isCopy = a => !isOriginal(a);


const runPath = (start, connections, path) => {
    let count = 0;
    path = `${path} - ${start}`;
    if (start === 'end') {
        console.log(path);
        return 1;
    }
    for (const [a, b] of connections) {
        if (a !== start) continue;
    
        const fewerConnections = [];
        for (const [src, dest] of connections) {
            // console.log(a, getOriginal(a) ,isOriginal(a), isCopy(a));
            if (isCopy(a) && (isCopy(src) || isCopy(dest))) continue; // throw out all other copies if we used a copy
            if (isLower(a) && (src === a || dest === a)) continue; // throw out all connections to already visited lowercase
            fewerConnections.push([src, dest]);
        }
        // console.log(fewerConnections);
        count += runPath(getOriginal(b), fewerConnections, path);
    }
    return count
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
