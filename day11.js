
let powerLevel = (x, y, serialNumber) => {
    let power = ((x + 10) * y + serialNumber) * (x + 10);
    power = Math.floor(power / 100) % 10;
    return power - 5;
}

let main = async () => {
    const GRIDSIZE = 5; // 300
    let serialNumber = 8; // 7672
    // 3,5 serial number 8 => 4
    // 122,79, grid serial number 57: power level -5.
    // Fuel cell at 217,196, grid serial number 39: power level  0.
    // Fuel cell at 101,153, grid serial number 71: power level  4.

    console.log(`${3}, ${5} = ${powerLevel(3, 5, 8)} should be 4`)
    console.log(`${122}, ${79} = ${powerLevel(122, 79, 57)} should be -5`)
    console.log(`${217}, ${196} = ${powerLevel(217, 196, 39)} should be 0`)
    console.log(`${101}, ${153} = ${powerLevel(101, 153, 71)} should be 4`)


    console.log();
}

main();