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
  let increaseCount = 0;
  let last1;
  let last2;
  let last3;

  let i = -1;

  for await (const line of rl) {
    i++;

    let lastSum = last1 + last2 + last3;

    last1 = last2;
    last2 = last3;
    last3 = Number(line);

    let currentSum = last1 + last2 + last3;

    if (i < 3) continue;

    if (currentSum > lastSum) increaseCount++;
  }

  console.log(increaseCount);

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
