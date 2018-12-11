
let powerLevel = (x, y, serialNumber) => {
    let power = ((x + 10) * y + serialNumber) * (x + 10);
    power = Math.floor(power / 100) % 10;
    return power - 5;
}

let main = async () => {
    const GRIDSIZE = 300;
    let serialNumber = 42; // 7672
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

    let max = Number.MIN_SAFE_INTEGER;
    let bestX;
    let bestY;
    let sum;
    for (let i = 1; i <= GRIDSIZE - 2; i++) {
        for (let j = 1; j <= GRIDSIZE - 2; j++) {
            sum = b[i][j] + b[i + 1][j] + b[i + 2][j] +
                b[i][j + 1] + b[i + 1][j + 1] + b[i + 2][j + 1] +
                b[i][j + 2] + b[i + 1][j + 2] + b[i + 2][j + 2];
            if (sum > max) {
                max = sum;
                bestX = i;
                bestY = j;
            }
        }
    }

    console.log(bestX, bestY); // 33,45 // 21,61
}

main();