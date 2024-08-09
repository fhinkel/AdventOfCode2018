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
  let numbers = [
    ["one", 1],
    ["two", 2],
    ["three", 3],
    ["four", 4],
    ["five", 5],
    ["six", 6],
    ["seven", 7],
    ["eight", 8],
    ["nine", 9],
    ["1", 1],
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
  ];

  for await (const line of rl) {
    // console.log(line);
    let firstIndex = Infinity;
    let firstDigit = 0;
    for ([number, integer] of numbers) {
      let index = line.indexOf(number);
      if (index !== -1) {
        firstIndex = Math.min(firstIndex, index);
        if (index === firstIndex) {
          firstDigit = integer;
        }
      }
    }
    let lastIndex = -1;
    let lastDigit = 0;
    for ([number, integer] of numbers) {
      let index = line.lastIndexOf(number);
      if (index !== -1) {
        lastIndex = Math.max(lastIndex, index);
        if(index === lastIndex) {
          lastDigit = integer;
        }
      }
    }
    const num = firstDigit * 10 + lastDigit;
    // console.log(firstDigit, lastDigit, line, num);
    sum += parseInt(num);
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
