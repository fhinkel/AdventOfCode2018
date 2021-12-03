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

  let forward = 0;
  let depth = 0;
  let aim = 0;

  for await (const line of rl) {
      const [direction, n] = line.split(" "); 
      switch (direction) {
        case 'forward':
          forward += Number(n);
          depth += Number(n) * aim;
          break;
        case 'up':
            aim -= Number(n);
            break;
        case 'down':
            aim += Number(n);
            break;
        default:
          console.log(`Sorry, we are out of ${direction}.`);
      }
  }

  console.log(forward * depth);

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
