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

    let res = 0;
    for await (const line of rl) {
        const [digits, outputs] = line.split('|').map(s => s.trim()).map(s => s.split(' ').map(d => d.split('').sort().join('')));
        // console.log(digits, outputs);

        let decoded = [];
        for (const digit of digits) {
            switch (digit.length) {
                case 2:
                    decoded[1] = digit;
                    break;
                case 4:
                    decoded[4] = digit;
                    break;
                case 3:
                    decoded[7] = digit;
                    break;
                case 7:
                    decoded[8] = digit;
                    break;
            }
        }

        // remove c and f positions (digit 1) to identify 3 and 6
        for (const digit of digits) {
            if (decoded.includes(digit)) continue;

            let count = complementCount(digit, decoded[1]);

            // digit 3 without right positions
            if (count === 3) {
                decoded[3] = digit;
            }
            // digit 6 without right positions
            if (count === 5) {
                decoded[6] = digit;
            }

            // left 0, 2, 5, 9
        }

        // remove everything but b and e position (digit 3) to identify 0
        for (const digit of digits) {
            if (decoded.includes(digit)) continue;

            // digit 0 without right positions
            if (complementCount(digit, decoded[3]) === 2) {
                decoded[0] = digit;
            }
            // left 2, 5, 9
        }

        // length 6 for digit 9
        for (const digit of digits) {
            if (decoded.includes(digit)) continue;
            if (digit.length === 6) {
                decoded[9] = digit;
            }
            // left 2, 5
        }

        // remove everything but c position (digit 6) to identify 2 and 5
        for (const digit of digits) {
            if (decoded.includes(digit)) continue;

            let count = complementCount(digit, decoded[6]);

            // digit 2 without positions from 6
            if (count === 1) {
                decoded[2] = digit;
            }

            // digit 5 without positions from 6
            if (count === 0) {
                decoded[5] = digit;
            }
        }
        
        let s = '';
        for (const digit of outputs) {
            s += decoded.indexOf(digit);
        }
        res += Number(s);
    }
    console.log(res);


    // fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
}


const complementCount = (A, B) => {
    let count = 0;
    for (const letter of A) {
        if (B.split('').includes(letter)) continue
        count++;
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
