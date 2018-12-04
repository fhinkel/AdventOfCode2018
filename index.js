const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input4.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    // console.log(inputs);
    return inputs;
}

let sleepsTheMost = (inputs) => {
    // <guard id, total sleep minutes>
    let sleeps = new Map();
    let currentGuard;
    let fallsAsleep;
    inputs.forEach(s => {
        // [1518-11-01 23:58] Guard #99 begins shift
        let newGuard = s.match(/#(?<id>\d+)/);
        if (newGuard) {
            currentGuard = newGuard.groups.id;
            // console.log(`New guard ${newGuard.groups.id}`);

        } else {
            // [1518-11-02 00:40] falls asleep
            // [1518-11-02 00:50] wakes up
            let m = s.match(/(?<hour>\d+):(?<minutes>\d+)]/);
            if (m.groups.hour !== '00') {
                console.log(`Sleep time is wrong: ${m.groups.hour}`);
                console.log(s);
                return;
            }
            let minutes = Number(m.groups.minutes);

            if (s.match(/falls asleep/)) {
                fallsAsleep = minutes;
            } else if (s.match(/wakes up/)) {
                let wakesUp = minutes;
                let total = wakesUp - fallsAsleep;
                if (total < 0) {
                    console.log(`Negative sleep? ${minutes} - ${fallsAsleep}`);
                    console.log(s);
                    return;
                }
                sleeps.set(currentGuard, total + (sleeps.get(currentGuard) || 0));
            }
        }
    })
    // console.log([...sleeps.entries()]); // #1217 sleeps the most

    let id;
    let maxValue = -1;

    [...sleeps.entries()].forEach(([k, v]) => {
        if (v > maxValue) {
            maxValue = v;
            id = k;
        }
    })
    return id;
}

let findMostSleepyMinute = (inputs) => {
    // < minute, [guards]>
    let sleep = new Map();

    let currentGuard;

    inputs.forEach(s => {
        // [1518-11-01 23:58] Guard #99 begins shift
        if (s.match(/#/)) {
            let { groups: { id } } = s.match(/#(?<id>\d+)/);
            currentGuard = id;
        } else {
            // [1518-11-02 00:40] falls asleep
            // [1518-11-02 00:50] wakes up
            let m = s.match(/(?<hour>\d+):(?<minutes>\d+)]/);
            let minutes = Number(m.groups.minutes);

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