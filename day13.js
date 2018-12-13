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

let move = (cart, grid) => {
    let nextTurns = ['ccw', 's', 'cw'];

    let [x, y] = [cart.x, cart.y];
    if (cart.d === 'u') {
        cart.y = cart.y - 1;
        let nextTrack = grid[y - 1][x];
        if (nextTrack === '/') {
            cart.d = 'r';
        } else if (nextTrack === '\\') {
            cart.d = 'l';
        } else if (nextTrack === '+') {
            if (cart.n === 'cw') {
                cart.d = 'r';
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            } else if (cart.n === 'ccw') {
                cart.d = 'l';
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            } else if (cart.n === 's') {
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            }
        } else if (nextTrack === '-') {
            throw new Error(`wrong direction, cart ${cart.x}, ${cart.y} going ${cart.d}`);
        }
    }
    if (cart.d === 'd') {
        cart.y = cart.y + 1;
        let nextTrack = grid[y + 1][x];
        if (nextTrack === '/') {
            cart.d = 'l';
        } else if (nextTrack === '\\') {
            cart.d = 'r';
        } else if (nextTrack === '+') {
            if (cart.n === 'cw') {
                cart.d = 'l';
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            } else if (cart.n === 'ccw') {
                cart.d = 'r';
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            } else if (cart.n === 's') {
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            }
        } else if (nextTrack === '-') {
            throw new Error(`wrong direction, cart ${cart.x}, ${cart.y} going ${cart.d}`);
        }
    }
    if (cart.d === 'l') {
        cart.x = cart.x - 1;
        let nextTrack = grid[y][x - 1];
        if (nextTrack === '/') {
            cart.d = 'd';
        } else if (nextTrack === '\\') {
            cart.d = 'u';
        } else if (nextTrack === '+') {
            if (cart.n === 'cw') {
                cart.d = 'u';
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            } else if (cart.n === 'ccw') {
                cart.d = 'd';
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            } else if (cart.n === 's') {
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            }
        } else if (nextTrack === '|') {
            throw new Error(`wrong direction, cart ${cart.x}, ${cart.y} going ${cart.d}`);
        }
    }
    if (cart.d === 'r') {
        cart.x = cart.x + 1;
        let nextTrack = grid[y][x + 1];
        if (nextTrack === '/') {
            cart.d = 'u';
        } else if (nextTrack === '\\') {
            cart.d = 'u';
        } else if (nextTrack === '+') {
            if (cart.n === 'cw') {
                cart.d = 'd';
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            } else if (cart.n === 'ccw') {
                cart.d = 'u';
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            } else if (cart.n === 's') {
                cart.n = nextTurns[(nextTurns.indexOf(cart.n) + 1) % 3];
            }
        } else if (nextTrack === '|') {
            throw new Error(`wrong direction, cart ${cart.x}, ${cart.y} going ${cart.d}`);
        }
    }
    return cart;
}

initializeGrid = (inputs) => {
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

    return [grid, carts];
}

let main = async () => {
    let inputs = (await readInput());
    let [grid, carts] = initializeGrid(inputs);

    print(grid);
    console.log(carts);

    let orderedCarts = carts.slice().sort((c1, c2) => {
        if (c1.y !== c2.y) {
            return c1.y - c2.y;
        }
        return c1.x - c2.x;
    })


    console.log(orderedCarts);
    for (let cart of orderedCarts) {
        cart = move(cart, grid);
        
    }
}


main();