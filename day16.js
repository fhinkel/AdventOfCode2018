const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input16.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let main = async () => {
    let inputs = (await readInput());
    //Before: [0, 0, 2, 2]
    // 9 2 3 0
    // After:  [4, 0, 2, 2]

    let examples = [];
    let example = [];

    for (let line of inputs) {
        let registersBefore = [];
        let registsersAfter = [];
        let instruction = [];
        if (line.match(/Before/)) {
            registersBefore = line.match(/\d/g).map(Number);
            example.push(registersBefore);
        }
        else if (line.match(/After/)) {
            registsersAfter = line.match(/\d/g).map(Number);
            example.push(registsersAfter)
            examples.push(example);
            example = [];
        }
        else if (line !== '') {
            instruction = line.match(/\d+/g).map(Number);
            example.push(instruction);
        }

        if (examples.length === 30) {
            console.log(examples)
            break;
        }

    }

    // add
    // mult
    // &
    // |
    // ass
    // gtr
    // equ
    let opcodes = [];

    let opcodeAddi = (a, b, c, before) => {
        // addi : reg + value
        before[c] = before[a] + b;
        return before;
    }

    opcodes.push(opcodeAddi);

    let count = 0;

    let equalRegisters = (r1, r2) => {
        if (r1.length !== r2.length) {
            console.log(`Wrong inputs: ${r1}, ${r2}`);
        }
        for (let i = 0; i < r1.length; i++) {
            if (r1[i] !== r2[i]) {
                return false;
            }
        }
        return true;
    }

    for (let [before, instruction, after] of examples) {
        let validOpCodes = [];
        for (let opcode of opcodes) {
            let res = opcode(instruction[1], instruction[2], instruction[3], before);

            if (equalRegisters(res, after)) {
                validOpCodes.push(opcode);
            }
        }
        if (validOpCodes.length > 0) {
            count++;
        }
    }

    console.log(count);
}

main();