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


  
  fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
}

const main = async () => {
  const path = '.';
  try {
    const files = glob.sync(`${path}/input1.txt`, {
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
