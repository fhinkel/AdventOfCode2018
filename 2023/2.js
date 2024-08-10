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

    let sum = 0;

    // 12 red cubes, 13 green cubes, and 14 blue cubes
    const cubes = {
        red: 12,
        green: 13,
        blue: 14,
    };

    for await (const line of rl) {
        // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        // console.log(line);
        var [game, numbers] = line.split(':');

        const rounds = numbers.split(';');

        (() => {
            for (const round of rounds) {
                const entries = round.split(',').map(x => x.trim());
                for (const entry of entries) {
                    const [num, color] = entry.split(' ');
                    if (cubes[color] < parseInt(num)) {
                        // console.log('Game', game, 'is invalid');
                        return;
                    }
                }
            }
            // console.log('Game', game, 'is valid');
            game = game.trim();
            game = parseInt(game.split(' ')[1]);
            sum += parseInt(game);
        })();

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
