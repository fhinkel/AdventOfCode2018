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
    while (ip < instructions.length) {
        let [ops, a, b, output] = instructions[ip];
        console.log(`${ip}, ${ops}, ${a}, ${b}, ${output}`)
        register[output] = opcodes.get(ops)(a, b, register);
        ip = register[instructionRegister];
        ip = ip + 1;
        register[instructionRegister] = ip;
    }
    console.log(register[3]);
    console.log(register);

    // want x0 === x3

    // let x3 = 0;
    // for(let i = 0; i < 1000; i++) {
    //     let start = x3;
    //     let count = 1000000;
    //     while ((x3 | 65536 >= 256) && count > 0) {
    //         x3 += ((( x3) | 65536) & 255 & 16777215) * 65899 & 16777215;
    //         count--;
    //     }
    //     if (count !== 0) {
    //         console.log(start, x3);
    //     }
    //     start++;
    //     x3 = start;
    // }
    // console.log(register[0]);
}

main();