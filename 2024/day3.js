const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input.txt');
    res = res.toString().split('\n')
        .map(line => line.split(/\s+/).map(Number));
    return res;

}

let findSafeReports = async (inputs) => {
    const isIncreasing = (arr) => {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] <= arr[i - 1]) { 
                return false;
            }
            const dist = arr[i] - arr[i - 1];
            if (dist > 3) {
                return false;
            }
        }
        return true;
    }

    const isDecreasing = (arr) => {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] >= arr[i - 1]) {
                return false;
            }
            const dist = arr[i - 1] - arr[i];
            if (dist > 3) {
                return false;
            }
        }
        return true;
    }

    let count = 0;
    for (const report of inputs) {
        if (isDecreasing(report) || isIncreasing(report)) {
            count++;
        } else {
            let combs = combinations(report)
            for (const comb of combs) {
                if (isDecreasing(comb) || isIncreasing(comb)) {
                    count++;
                    break;
                }
            }
        }
    }

    return count
}

const combinations = (arr) => {
    let combs = []
    for (let i = 0; i < arr.length; i++) {
        let comb = [...arr.slice(0, i), ...arr.slice(i + 1)]
        combs.push(comb)
    }
    return combs
}

let main = async () => {
    let inputs = await readInput();
    let sum = await findSafeReports(inputs);
    console.log(sum);
    console.log("3");
}

main();