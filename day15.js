const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input15.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs
}

let initialize = (inputs) => {
    let board = Array(inputs.length).fill().map(() => []);
    let elfs = new Set();
    let goblins = new Set();
    // {i, j, hitPoints = 200 }

    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < inputs[0].length; j++) {
            board[j][i] = inputs[i][j];
            if (inputs[i][j] === 'E') {
                let elf = { x:j, y:i, u: 'E', hitPoints: 200 };
                elfs.add(elf);
            }
            if (inputs[i][j] === 'G') {
                let goblin = { x:j, y:i, u: 'G', hitPoints: 200 };
                goblins.add(goblin);
            }
        }
    }

    console.log(board);
    console.log(elfs);
    console.log(goblins);

    return [board, elfs, goblins];
}

let sortUnits = (elfs, goblins) => {
    let units = [...elfs.values(), ...goblins.values()];

    console.log(units);
    units.sort((u1, u2) => {
        if(u1.y !== u2.y) {
            return u1.y - u2.y;
        }
        return u1.x - u2.x;
    });

    return units;
}

let main = async () => {
    let inputs = (await readInput());
    let [board, elfs, goblins] = initialize(inputs);
    let units = sortUnits(elfs, goblins);
    console.log(units);

}


main();