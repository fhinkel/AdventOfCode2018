const { on } = require('cluster');

const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./../input.txt');
    res = res.toString().split('\n')
        .map(line => line.split(/\s+/).map(Number));
    // console.log(res);
    return res;

}

let findSafeReports = async (inputs) => {
    // input array of 2 number pairs

    const isIncreasing = (org) => {
        let arr = [...org]
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] <= arr[i - 1]) { // 
                return false;
            }
            const dist = arr[i] - arr[i - 1];
            if (dist > 3) {
                return false;
            }
            return true;
        }
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
        }
    }

    return count
}

// 1 2 3 4 6 5 9 10 

let main = async () => {
    let inputs = await readInput();
    let sum = await findSafeReports(inputs);
    console.log(sum);
}

main();