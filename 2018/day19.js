const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input19.txt');
    // let res = await fs.readFile('./testInput.txt');
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
        let [ops, a, b, output] = line.split(' ');
        instructions.push([ops, Number(a), Number(b), Number(output)]);
    }

    let register = [1, 0, 0, 0, 0, 0];
    let ip = 0;
    while (ip < instructions.length) {
        if (ip === 3 && register[1] !== 0) { // gtrr 3 4 5
            if (register[4] % register[1] === 0) {
                register[0] = register[0] + register[1];
            }
            register[3] = register[4] + 1;
            register[5] = 1; // Now the comparison is true
            ip = 12;
            continue;
        }
        let [ops, a, b, output] = instructions[ip];
        register[output] = opcodes.get(ops)(a, b, register);
        ip = register[instructionRegister];
        ip = ip + 1;
        register[instructionRegister] = ip;
    }

    // while(!(x3 > x4)) {
    //     if(x1*x3 === x4) {
    //         x0 = x0 + x1;
    //     } 
    //     x3++;
    // } 
    // same as 
    // if(x4%x1 === 0) {
    //     x0 = x0 + x1;
    // }
    // x3 = x4+1;



    console.log(register[0]);
}

main();