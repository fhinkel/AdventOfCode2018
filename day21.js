const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input21.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let main = async () => {
    let inputs = await readInput();

    let opcodeAddr = (a, b, before) => {
        // addi : reg + reg
        return before[a] + before[b];
    }
    let opcodeAddi = (a, b, before) => {
        // addi : reg + value
        return before[a] + b;
    }

    let opcodeMulr = (a, b, before) => {
        // mul : reg * reg
        return before[a] * before[b];
    }
    let opcodeMuli = (a, b, before) => {
        // mul : reg * value
        return before[a] * b;
    }

    let opcodeBanr = (a, b, before) => {
        // bitwise And : reg & reg
        return before[a] & before[b];
    }
    let opcodeBani = (a, b, before) => {
        // bitwise And : reg & value
        return before[a] & b;
    }

    let opcodeBorr = (a, b, before) => {
        // bitwise Or : reg | reg
        return before[a] | before[b];
    }
    let opcodeBori = (a, b, before) => {
        // bitwise Or : reg | value
        return before[a] | b;
    }

    let opcodeSetr = (a, b, before) => {
        // assign: copies register a into c
        return before[a];
    }
    let opcodeSeti = (a, b, before) => {
        // assign: copies value a into c
        return a;
    }

    let opcodeGtir = (a, b, before) => {
        // value A greater than register B
        return a > before[b] ? 1 : 0;
    }
    let opcodeGtri = (a, b, before) => {
        // register A greater than value B
        return before[a] > b ? 1 : 0;
    }
    let opcodeGtrr = (a, b, before) => {
        // register A greater than register B
        return before[a] > before[b] ? 1 : 0;
    }

    let opcodeEqir = (a, b, before) => {
        // value A equal to register B
        return a === before[b] ? 1 : 0;
    }
    let opcodeEqri = (a, b, before) => {
        // register A equal to value B
        return before[a] === b ? 1 : 0;
    }
    let opcodeEqrr = (a, b, before) => {
        // register A equal to register B
        return before[a] === before[b] ? 1 : 0;
    }

    let opcodes = new Map();
    opcodes.set('addi', opcodeAddi);
    opcodes.set('addr', opcodeAddr);
    opcodes.set('mulr', opcodeMulr);
    opcodes.set('muli', opcodeMuli);
    opcodes.set('banr', opcodeBanr);
    opcodes.set('bani', opcodeBani);
    opcodes.set('borr', opcodeBorr);
    opcodes.set('bori', opcodeBori);
    opcodes.set('setr', opcodeSetr);
    opcodes.set('seti', opcodeSeti);
    opcodes.set('gtir', opcodeGtir);
    opcodes.set('gtri', opcodeGtri);
    opcodes.set('gtrr', opcodeGtrr);
    opcodes.set('eqir', opcodeEqir);
    opcodes.set('eqri', opcodeEqri);
    opcodes.set('eqrr', opcodeEqrr);

    if (opcodes.size !== 16) {
        console.log('Counting is hard');
        return;
    }
    // #ip 0
    let instructionRegister = Number(inputs.shift().split(' ')[1]);

    let instructions = [];
    for (let line of inputs) {
        let [, ops, a, b, output] = line.split(' ');
        instructions.push([ops, Number(a), Number(b), Number(output)]);
    }

    let register = [0, 0, 0, 0, 0, 0];
    let ip = 0;
    let m = new Set();
    let sequence = [];
    let count = 0
    while (ip < instructions.length && count < 3) {
        if (ip === 28) {
            count++;
            let n = register[3];
            sequence.push(n);
            console.log(n);
        }
        let [ops, a, b, output] = instructions[ip];
        register[output] = opcodes.get(ops)(a, b, register);
        ip = register[instructionRegister];
        ip = ip + 1;
        // if (ip === 18) {
        //     register[1] = Math.floor(register[1] / 256);
        //     ip = 8;
        // }
        register[instructionRegister] = ip;
    }
    console.log(register)

    
    // 6578059 too high
    // 8021722

    // do {
    //     x3 = 4921097; // ip 8
    //     x4 = r1 & 255;
    //     r3 = r3 + r4;
    //     r3 = r3 & 16777215;
    //     r3 = r3 * 65899;
    //     r3 = r3 & 16777215;

    //     if (256 <= r1) { // ip 13
    //         r1 = Math.floor(r1 / 256);
    //         if (r1 === 0) {
    //             console.log(registers);
    //             throw new Error();
    //         }
    //     }
    // } while (x3 !== x0)
}



main();