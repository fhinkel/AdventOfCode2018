const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input7.txt');
    let res = await fs.readFile('./test_input2.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let main = async () => {
    let workers = [];
    const NUMBER_OF_WORKERS = 2; // 5
    const TASK_DELAY = 0; // 60
    for (let i = 0; i < NUMBER_OF_WORKERS; i++) {
        workers.push(0);
    }

    let inputs = await readInput();

    // <task, [dependencies]>
    let taskOrders = new Map();

    // All letters showing up in task
    let letters = new Set();

    for (let input of inputs) {
        let left = input.split(' ')[1];
        let right = input.split(' ')[7];
        // console.log(`${left} and ${right}`)
        letters.add(left);
        letters.add(right);
        if (!taskOrders.has(right)) {
            taskOrders.set(right, new Set());
        }
        taskOrders.get(right).add(left);
    }

    let potentialNextTask = [];
    for (let letter of [...letters.values()].sort()) {
        if (!taskOrders.has(letter)) {
            potentialNextTask.push(letter);
        }
    }

    let totalTime = 0;
    let tasksStarted = new Map();

    let freeWorkers = workers.reduce(function (a, e, i) {
        if (e === 0) {
            a.push(i);
        }
        return a;
    }, [])

    while (potentialNextTask.length || (freeWorkers.length !== NUMBER_OF_WORKERS)) {
        // <task, worker index>
        if (workers.indexOf(0) === -1) {
            // Nobody is free
            let shortest = Math.min(...workers);
            totalTime += shortest;
            workers = workers.map(w => w - shortest);
        }

        freeWorkers = workers.reduce(function (a, e, i) {
            if (e === 0) {
                a.push(i);
            }
            return a;
        }, []);

        while (freeWorkers.length && potentialNextTask.length) {
            let i = freeWorkers.shift();
            let l = potentialNextTask.shift();
            workers[i] = l.charCodeAt() - 64 + TASK_DELAY;
            tasksStarted.set(i, l);
            console.log(`Worker ${i} started ${l}, taking ${workers[i]} seconds`);
        }


        console.log(`Workers after starting tasks: ${workers}`);

        if (!potentialNextTask.length) {
            console.log(`No more tasks, lets wait for one to finish`);
            let min = Math.min(...workers.filter(w => w !== 0 ));
            totalTime += min;
            workers = workers.map(w => {
                if(w === 0 ) {
                    return w;
                }
                return w - min;
            });
        }

        freeWorkers = workers.reduce(function (a, e, i) {
            if (e === 0) {
                a.push(i);
            }
            return a;
        }, []);

        for (let freeWorker of freeWorkers) {
            let l = tasksStarted.get(freeWorker);
            if(!l) {
                continue;
            }
            console.log(`Task that was just finished: ${l}`);
            if(l === 'B') {
                console.log(taskOrders);
            }
            
            // Remove l from all the prerequisites because we finished it.
            for (let [key, preq] of [...taskOrders.entries()]) {
                // console.log(` ${key} and ${[...preq]}`);
                for (let [index, task] of tasksStarted) {
                    // console.log(`Delete from ${task}`)
                    preq.delete(task);
                }
                if (preq.size == 0) {
                    potentialNextTask.push(key);
                    taskOrders.delete(key);
                }
            }
            if(l === 'B') {
                console.log(taskOrders);
            }
        }
        potentialNextTask.sort();
        console.log(`Next tasks: ${potentialNextTask}`);
    }
    totalTime += Math.max(...workers);
    console.log(totalTime);
}

main();