const fetch = require('node-fetch');
const fs = require('fs').promises;

let readInput = async () => {
    // let res = await fs.readFile('./input4.txt');
    let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    // console.log(inputs);
    return inputs;
}

let bestMinute = (inputs) => {
    inputs.sort();

    // <guard id, total sleep minutes>
    let sleeps = new Map();
    let currentGuard;
    let fallsAsleep;
    inputs.forEach(s => {
        // [1518-11-01 23:58] Guard #99 begins shift
        let newGuard = s.match(/#(?<id>\d+)/);
        if(newGuard) {
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

            if(s.match(/falls asleep/)) {
                fallsAsleep = minutes;
            } else if (s.match(/wakes up/)) {
                let wakesUp = minutes;
                let total = wakesUp - fallsAsleep;
                if (total < 0) {
                    console.log(`Negative sleep? ${minutes} - ${fallsAsleep}`);
                    console.log(s);
                    return;
                }
                console.log(total);
                sleeps.set(currentGuard, total + (sleeps.get(currentGuard) || 0));
            }
        }
    })
    console.log([...sleeps.entries()]);
        
    

    let minute = 0;
    
    return minute;
}


let main = async () => {
    let inputs = await readInput();

    let res = await bestMinute(inputs);
    console.log(res);
}

main();