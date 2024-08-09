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

  for await (const line of rl) {
    // console.log(line);
    let num = "";
    for(char of line) {
        if(!Number.isNaN(parseInt(char))) {
            num += char;
            break;
        }
    }
    for(char of line.split('').reverse().join('')) {
        if(!Number.isNaN(parseInt(char))) {
            num += char;
            break;
        }
    }
    // console.log(num);
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
