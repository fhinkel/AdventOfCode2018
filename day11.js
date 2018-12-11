
let powerLevel = (x, y, serialNumber) => {
    let power = ((x + 10) * y + serialNumber) * (x + 10);
    power = Math.floor(power / 100) % 10;
    return power - 5;
}

const GRIDSIZE = 300;
let serialNumber = 7672;

let b = [];
for (let i = 1; i <= GRIDSIZE; i++) {
    b[i] = [];  // Add one row
}


for (let i = 1; i <= GRIDSIZE; i++) {
    for (let j = 1; j <= GRIDSIZE; j++) {
        b[i][j] = powerLevel(i, j, serialNumber);
    }
}

// contains sum of square with upper, left corner i,j
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


for (let size = 1; size <= GRIDSIZE; size++) {
    for (let i = 1; i <= GRIDSIZE - size + 1; i++) {
        for (let j = 1; j <= GRIDSIZE - size + 1; j++) {
            let sum = subSums[i][j];
            for (let h = 0; h < size; h++) {
                sum += b[i + h][j + size - 1] + b[i + size - 1][j + h];
            }
            sum -= b[i + size - 1][j + size - 1]; // delete right,lower corner
            if (sum > max) {
                max = sum;
                bestX = i;
                bestY = j;
                bestSize = size;
            }
            subSums[i][j] = sum;
        }
    }
}

console.log(bestX, bestY, bestSize);