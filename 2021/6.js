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

    let data = [];

    for await (const line of rl) {
        // 0,9 -> 5,9
        data.push(...(line.split(',').map(Number)));
    }

    let school = Array(9).fill(0);
    for (const age of data) {
        school[age] = (school[age] | 0) + 1;
    }


    let n = 256;

    let newSchool = [];

    for (let i = 0; i < n; i++) {
        newSchool[8] = school[0];
        newSchool[6] = school[0];
        for (let age = 1; age <=8; age++) {
            newSchool[age-1] = school[age];
        }
        newSchool[6] = newSchool[6] + school[0];
        // console.log(newData);
        school = [...newSchool];
        newSchool = [];
    }

    const sum = school.reduce((a,b) => a+b, 0);
    console.log(sum);


    // fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
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
