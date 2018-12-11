
let powerLevel = (x, y, serialNumber) => {
    let power = ((x + 10) * y + serialNumber) * (x + 10);
    power = Math.floor(power / 100) % 10;
    return power - 5;
}

let main = async () => {
    const GRIDSIZE = 300;
    let serialNumber = 7672;
    // 3,5 serial number 8 => 4
    // 122,79, grid serial number 57: power level -5.
    // Fuel cell at 217,196, grid serial number 39: power level  0.
    // Fuel cell at 101,153, grid serial number 71: power level  4.

    console.log(`${3}, ${5} = ${powerLevel(3, 5, 8)} should be 4`)
    console.log(`${122}, ${79} = ${powerLevel(122, 79, 57)} should be -5`)
    console.log(`${217}, ${196} = ${powerLevel(217, 196, 39)} should be 0`)
    console.log(`${101}, ${153} = ${powerLevel(101, 153, 71)} should be 4`)

    let b = [];
    for (let i = 1; i <= GRIDSIZE; i++) {
        b[i] = [];  // Add one row
    }


    for (let i = 1; i <= GRIDSIZE; i++) {
        for (let j = 1; j <= GRIDSIZE; j++) {
            b[i][j] = powerLevel(i, j, serialNumber);
        }
    }

    let subSums = [];
    for (let i = 1; i <= GRIDSIZE; i++) {
        subSums[i] = [];  // Add one row
        for (let j = 1; j <= GRIDSIZE; j++) {
            subSums[i][j] = b[i][j];
        }
    }


    let max = Number.MIN_SAFE_INTEGER;
    let bestX;
    let bestY;
    let sum;
    let bestSize = 1;


    // largest sum 1D
    // 
    for (let size = 1; size <= GRIDSIZE; size++) {
        for (let i = 1; i <= GRIDSIZE - size + 1; i++) {
            for (let j = 1; j <= GRIDSIZE - size + 1; j++) {
                sum = subSums[i][j];
                for (let h = 0; h < size; h++) {
                    // if(!b[i+h]) {
                    //     console.log(i,h,i+h)
                    // }
                    // if(!b[i+size]) {
                    //     console.log(i, size, i+size)
                    // }
                    sum = subSums[i][j] + b[i + h][j + size - 1] + b[i + size - 1][j + h];
                }
                if (sum > max) {
                    max = sum;
                    bestX = i;
                    bestY = j;
                }
                subSums[i][j] = sum;
            }
        }
    }

    console.log(bestX, bestY, bestSize); // 33,45 // 21,61
}


// let largestSum = () => {
//     let a = [3,4,-2,-6,-7, 12,13]


// }



main();