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

    let dots = [];
    const folds = [];
    for await (const line of rl) {
        if (line.includes(',')) {
            let [x, y] = line.split(',').map(n => Number(n));
            dots.push([x, y]);
        }
        if (line.includes('fold')) {
            let [direction, n] = line.split('=');
            direction = direction[direction.length - 1];
            folds.push([direction, Number(n)]);
        }
    }


    let newDots = [];
    let s;
    for (const [dir, n] of folds) {
        if (dir === 'y') {
            newDots = foldUp(dots, n);
        }
        else if (dir === 'x') {
            newDots = foldLeft(dots, n);
        }
        // make unique
        s = new Set(newDots);
        dots = Array.from(s);
        dots = dots.map(s => s.split(','));
    }

    let xMax = 0;
    let yMax = 0;

    for (const [x, y] of dots) {
        xMax = Math.max(x, xMax);
        yMax = Math.max(y, yMax);
    }

    console.log(xMax, yMax);

    let plot = [];
    for (let i = 0; i <= yMax; i++) {
        plot[i] = [];
        for (let j = 0; j <= xMax; j++) {
            plot[i][j] = '.';
        }
    }

    for (const [x, y] of dots) {
        plot[y][x] = '#'
    }

    plot = plot.map(row => row.join(''));
    // console.log(plot);
    for (const line of plot) {
        console.log(line);
    }


    // console.log(s.size);

}

const foldUp = (dots, n) => {
    let newDots = [];

    for (const [x, y] of dots) {
        if (y < n) {
            newDots.push([x, y]);
        } else {
            const dist = y - n;
            newDots.push([x, y - dist * 2]);
        }
    }
    return newDots.map(a => a.join(','));
}

const foldLeft = (dots, n) => {
    let newDots = [];

    for (const [x, y] of dots) {
        if (x < n) {
            newDots.push([x, y]);
        } else {
            const dist = x - n;
            newDots.push([x - dist * 2, y]);
        }
    }
    return newDots.map(a => a.join(','));
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
