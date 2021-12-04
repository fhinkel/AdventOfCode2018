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

  const gamma = [];
  const epsilon = [];
  const oneCounts = [];
  const zeroCounts = [];

  const data = [];

  for await (const line of rl) {
      const bits = line.split(''); 
      data.push(bits);
  }

  let oxyCopy = [...data];
  let scrubberCopy = [...data];

  let i = 0;
  while(oxyCopy.length > 1) {
      let [oneCount, zeroCount] = count(oxyCopy, i);
      let bitCriteria = oneCount >= zeroCount ? 1 : 0;
      
      oxyCopy = oxyCopy.filter(bits => Number(bits[i]) === bitCriteria);
      i++;
  }

  i = 0;
  while(scrubberCopy.length > 1) {
    let [oneCount, zeroCount] = count(scrubberCopy, i);
    let bitCriteria = zeroCount <= oneCount ? 0 : 1;
    
    scrubberCopy = scrubberCopy.filter(bits => Number(bits[i]) === bitCriteria);
    // console.log(i, bitCriteria, oneCount, zeroCount)
    // console.log(scrubberCopy);
    i++;
}

//   console.log(oxyCopy);

  const oxy = parseInt(oxyCopy[0].join(''), 2);
  const scrubber = parseInt(scrubberCopy[0].join(''), 2);

  console.log(oxy);
  console.log(scrubber);

  console.log(oxy*scrubber)

  // fs.writeFileSync("output.txt", data.join('\n'), 'utf-8');
}

const count = (data, i) => {
    let oneCount = 0;
    let zeroCount = 0;
    for (const bits of data) {
        const bit = bits[i]; 
        if(Number(bit) === 1) {
            oneCount++;
        } else {
            zeroCount++;
        }
    }
    return [oneCount, zeroCount];
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
