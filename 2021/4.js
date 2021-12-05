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
    
    const data = [];
    
    for await (const line of rl) {
        data.push(line);
    }
    
    let numbers = data.shift().trim().split(','); // should we run unique?
    numbers = numbers.map(n=>Number(n));
    data.shift();
    
    const MAX_TRIES = numbers.length;
    const BOARD_SIZE = 5;

    const boards = [];
    while (data.length > 0) {
        let board = []
        for (let i = 0; i < BOARD_SIZE; i++) {
            board.push(data.shift().trim().split(/\s+/));
        }
        boards.push(board);
        data.shift(); // remove new line between boards
    }

    for(const board of boards) {
        for(const line of board) {
            for(let i = 0; i < board.length; i++) {
                line[i] = [Number(line[i]), MAX_TRIES];
            }
        }
    }
    
    // Mark every bingo board number with the time it takes until it is called
    for(const [index, number] of numbers.entries()) {
        for(const board of boards) {
            for(const line of board) {
                for(let i = 0; i < board.length; i++) {
                    if(number === line[i][0]) {
                        line[i][1] = index; 
                    }
                }
            }
        }
    }

    const smallest = [];
    for(const board of boards) {
        smallest.push(bingoTime(board));
    }

    // console.log(smallest);

    let minIndex;
    let last = MAX_TRIES;
    for(const [index, entry] of smallest.entries()) {
        if (entry < last) {
            minIndex = index;
            last = entry;
        }
    }

    console.log(`The winning board is ${minIndex} (0 indexed) 
    after ${smallest[minIndex]} numbers, the winning number is ${numbers[smallest[minIndex]]}.`);

    const winningBoard = boards[minIndex];

    let sum = 0;

    for(const line of winningBoard) {
        for(const [value, index] of line) {
            if(index > smallest[minIndex]) {
                sum  += value; 
            }
        }
    }


    console.log(sum);
    console.log(sum * numbers[smallest[minIndex]]);

    // fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
}

const transpose = (a) => {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

const bingoTimeRow = (board) => {
    // console.log(board);
    let minRowTime = Number.POSITIVE_INFINITY;
    for(const line of board) {
        let times = line.map(([number,time]) => time);
        if(Math.max(...times) < minRowTime) {
            minRowTime = Math.max(...times);
        };
    }
    return minRowTime;
}

// Time until bingo for this board
const bingoTime = (board) => {
    let minRowTime = bingoTimeRow(board);
    let minColumnTime = bingoTimeRow(transpose(board));

    // console.log(minRowTime, minColumnTime, Math.min(minRowTime, minColumnTime));
    
    return Math.min(minRowTime, minColumnTime);
}

const main = async () => {
    const path = '.';
    try {
        const files = glob.sync(`${path}/*.txt`, {
            ignore: ['node_modules'],
        });
        for (const file of files) {
            console.log(file);
            const stat = statSync(file);
            if (!stat.isFile()) continue;
            processLineByLine(file);
        }
    } catch (err) {
        console.error(err);
    }
};

main();
