const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input16.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let initialize = (inputs) => {
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
    }
    return examples;
}

let main = async () => {
    let inputs = (await readInput());
    let examples = initialize(inputs);

    let opcodes = [];

    let opcodeAddr = (a, b, c, before) => {
        // addi : reg + reg
        before[c] = before[a] + before[b];
        return before;
    }
    let opcodeAddi = (a, b, c, before) => {
        // addi : reg + value
        before[c] = before[a] + b;
        return before;
    }

    let opcodeMulr = (a, b, c, before) => {
        // mul : reg * reg
        before[c] = before[a] * before[b];
        return before;
    }
    let opcodeMuli = (a, b, c, before) => {
        // mul : reg * value
        before[c] = before[a] * b;
        return before;
    }

    let opcodeBanr = (a, b, c, before) => {
        // bitwise And : reg & reg
        before[c] = before[a] & before[b];
        return before;
    }
    let opcodeBani = (a, b, c, before) => {
        // bitwise And : reg & value
        before[c] = before[a] & b;
        return before;
    }

    let opcodeBorr = (a, b, c, before) => {
        // bitwise Or : reg | reg
        before[c] = before[a] | before[b];
        return before;
    }
    let opcodeBori = (a, b, c, before) => {
        // bitwise Or : reg | value
        before[c] = before[a] | b;
        return before;
    }

    let opcodeSetr = (a, b, c, before) => {
        // assign: copies register a into c
        before[c] = before[a];
        return before;
    }
    let opcodeSeti = (a, b, c, before) => {
        // assign: copies value a into c
        before[c] = a;
        return before;
    }

    let opcodeGtir = (a, b, c, before) => {
        // value A greater than register B
        before[c] = a > before[b] ? 1 : 0;
        return before;
    }
    let opcodeGtri = (a, b, c, before) => {
        // register A greater than value B
        before[c] = before[a] > b ? 1 : 0;
        return before;
    }
    let opcodeGtrr = (a, b, c, before) => {
        // register A greater than register B
        before[c] = before[a] > before[b] ? 1 : 0;
        return before;
    }

    let opcodeEqir = (a, b, c, before) => {
        // value A equal to register B
        before[c] = a === before[b] ? 1 : 0;
        return before;
    }
    let opcodeEqri = (a, b, c, before) => {
        // register A equal to value B
        before[c] = before[a] === b ? 1 : 0;
        return before;
    }
    let opcodeEqrr = (a, b, c, before) => {
        // register A equal to register B
        before[c] = before[a] === before[b] ? 1 : 0;
        return before;
    }



    opcodes.push(opcodeAddr);
    opcodes.push(opcodeAddi);
    opcodes.push(opcodeMulr);
    opcodes.push(opcodeMuli);
    opcodes.push(opcodeBanr);
    opcodes.push(opcodeBani);
    opcodes.push(opcodeBorr);
    opcodes.push(opcodeBori);
    opcodes.push(opcodeSetr);
    opcodes.push(opcodeSeti);
    opcodes.push(opcodeGtir);
    opcodes.push(opcodeGtri);
    opcodes.push(opcodeGtrr);
    opcodes.push(opcodeEqir);
    opcodes.push(opcodeEqri);
    opcodes.push(opcodeEqrr);

    let count = 0;

    if (opcodes.length !== 16) {
        console.log('Counting is hard');
        return;
    }

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
        for (let i = 0; i < opcodes.length; i++) {
            const opcode = opcodes[i];
            let res = opcode(instruction[1], instruction[2], instruction[3], before.slice());

            if (equalRegisters(res, after)) {
                // console.log('equal')
                // console.log(i);
                validOpCodes.push(opcode);
            }
        }
        if (validOpCodes.length >= 3) {
            count++;
        }
    }

    console.log(count);
}

main();