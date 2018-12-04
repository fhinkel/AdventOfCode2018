const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input4.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let findMostSleepyMinute = (inputs) => {
    // < minute, [guards]>
    let sleep = new Map();

    let currentGuard;

    inputs.forEach(s => {
        // [1518-11-01 23:58] Guard #99 begins shift
        if (s.match(/#/)) {
            ({ groups: { id: currentGuard } } = s.match(/#(?<id>\d+)/));
        } else {
            // [1518-11-02 00:40] falls asleep
            // [1518-11-02 00:50] wakes up
            let {groups: {minutes}} = s.match(/\d+:(?<minutes>\d+)]/);
            minutes = Number(minutes);

            if (s.match(/falls asleep/)) {
                fallsAsleep = minutes;
            } else if (s.match(/wakes up/)) {
                let wakesUp = minutes;
                for (let i = fallsAsleep; i < wakesUp; i++) {
                    let previous = sleep.get(i) || [];
                    previous.push(currentGuard)
                    sleep.set(i, previous);
                }
            }
        }
    })

    let maxPair = (map) => {
        let maxKey;
        let maxValue = -1;
        [...map.entries()].forEach(([k, v]) => {
            if (v > maxValue) {
                maxValue = v;
                maxKey = k;
            }
        })
        return [maxKey, maxValue];
    }

    let minute;
    let maxOccurance = -1;
    let maxGuard;
    [...sleep.entries()].forEach(([m, g]) => {
        let guards = new Map();
        g.forEach(id => {
            guards.set(id, (guards.get(id) || 0) + 1);
        });

        let [guard, occurance] = maxPair(guards);
        if (occurance > maxOccurance) {
            minute = m;
            maxOccurance = occurance;
            maxGuard = guard;
        }
    })

    return minute * maxGuard;
}

let main = async () => {
    let inputs = await readInput();
    inputs.sort();
    let res = findMostSleepyMinute(inputs);
    console.log(res);
}

main();