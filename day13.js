const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input13.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs
}

print = (grid) => {
    for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].join(''));
    }
}

let main = async () => {
    let inputs = (await readInput());
    let h = inputs.length;
    let w = inputs[0].length;
    console.log(`Working ${w} x ${h} grid`);

    let grid = [];

    let carts = [];
    for (let i = 0; i < h; i++) {
        grid[i] = [];
    }

    // Directions: l, r, u, d
    // Direction of Next turn: ccw, s, cw
    // cart = {x, y, d, l}
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            // |- /\ <>^v
            if (inputs[i][j] === '<' || inputs[i][j] === '>') {
                grid[i][j] = '-';
                if (inputs[i][j] === '<') {
                    let cart = { x: j, y: i, d: 'l', n: 'ccw' }
                    carts.push(cart);
                } else {
                    let cart = { x: j, y: i, d: 'r', n: 'ccw' }
                    carts.push(cart);
                }
            } else if (inputs[i][j] === '^' || inputs[i][j] === 'v') {
                grid[i][j] = '|';
                if (inputs[i][j] === '^') {
                    let cart = { x: j, y: i, d: 'u', n: 'ccw' }
                    carts.push(cart);
                } else {
                    let cart = { x: j, y: i, d: 'd', n: 'ccw' }
                    carts.push(cart);
                }
            } else {
                grid[i][j] = inputs[i][j];
            }
        }
    }

    print(grid);
    console.log(carts);



    console.log();
}

main();