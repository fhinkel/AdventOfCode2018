const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input7.txt');
    // let res = await fs.readFile('./test_input2.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let main = async () => {
    let inputs = await readInput();

    // <task, [dependencies]>
    let prerequisites = new Map();

    // All letters showing up in task
    let letters = new Set();

    for (let input of inputs) {
        let left = input.split(' ')[1];
        let right = input.split(' ')[7];
        // console.log(`${left} and ${right}`)
        letters.add(left);
        letters.add(right);
        if (!prerequisites.has(right)) {
            prerequisites.set(right, new Set());
        }
        prerequisites.get(right).add(left);
    }

    let potentialNextTask = [];
    let finishedTasks = [];
    for (let letter of [...letters.values()].sort()) {
        if (!prerequisites.has(letter)) {
            potentialNextTask.push(letter);
        }
    }

    while (potentialNextTask.length) {
        let l = potentialNextTask.shift();
        finishedTasks.push(l);
        // Remove l from all the prerequisites because we finished it.
        for (let [key, p] of [...prerequisites.entries()]) {
            p.delete(l);
            if (p.size == 0) {
                potentialNextTask.push(key);
                prerequisites.delete(key);
            }
        }
        potentialNextTask.sort();
    }
    console.log(finishedTasks.join(''));

}

main();