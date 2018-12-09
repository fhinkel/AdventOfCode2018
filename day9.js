const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input9.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs.filter(s => s[0] !== '/');
}

// let node: value, left, right


let play = (n, marble) => {
    let scoreboard = [];
    for (let i = 0; i < n; i++) {
        scoreboard[i] = 0;
    }

    let nextMarble = 0;
    let current = { value: nextMarble }
    current.left = current;
    current.right = current;

    nextMarble++;

    let player = 0;
    while (nextMarble <= marble) {
        // let debug = [];
        // debug.push(current.value);
        // let foo = current.right;
        // while(foo.value !== current.value) {
        //     debug.push(foo.value);
        //     foo = foo.right;
        // }
        // console.log(debug);
        if (nextMarble % 23 !== 0) {
            // place clockwise after 1 marble
            let left = current.right;
            let right = current.right.right;
            let newMarble = { value: nextMarble, left, right };
            left.right = newMarble;
            right.left = newMarble;
            current = newMarble;
        } else {
            // score marble
            scoreboard[player] += nextMarble;
            //remove 7 counter clockwise
            for (let i = 1; i < 7; i++) {
                current = current.left;
            }
            let removed = current.left;
            removed.left.right = current;
            current.left = removed.left;
            scoreboard[player] += removed.value;
            console.log(`Player ${player} scored ${nextMarble}.`);
            console.log(`They removed ${removed.value} and ${current.value} is current`);
        }
        player = (player + 1) % n;
        nextMarble++;
    }
    return scoreboard;
}

let main = async () => {
    let inputs = (await readInput());
    for (let line of inputs) {
        // 9 players; last marble is worth 25 points: high score is 32
        line = line.split(' ');
        let [numberOfPlayers, lastMarble] = [line[0], line[6]];
        console.log(`We are playing with ${numberOfPlayers} players and ${lastMarble} marbles.`);
        let scoreboard = play(numberOfPlayers, lastMarble); // should be 32
        console.log(Math.max(...scoreboard));
    }
}

main();