const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input15.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs
}

let main = async () => {
    let inputs = (await readInput());

    let board = Array(inputs.length).fill().map(()=> []);
    let elfs = new Set();
    let goblins = new Set();
    // {i, j, hitPoints = 200 }

    for(let i = 0; i < inputs.length; i++) {
        for(let j = 0; j < inputs[0].length; j++) {
            board[i][j] = inputs[i][j];
            if(inputs[i][j] === 'E') {
                let elf = {i, j, hitPoints : 200 };
                elfs.add(elf);
            }
            if(inputs[i][j] === 'G') {
                let goblin = {i, j, hitPoints : 200 };
                goblins.add(goblin);
            }
        }
    }


    console.log(board);
    console.log(elfs);
    console.log(goblins);
}


main();