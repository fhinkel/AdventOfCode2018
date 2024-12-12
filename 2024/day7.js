const fs = require('fs');

let readInput = () => {
    let res = fs.readFileSync('./input.txt');
    // let res = fs.readFileSync('./test-input.txt');
    res = res.toString().split('\n').map(line => line.trim())
    return res;
}

const sumEquation = (line) => {
    // 190: 10 19    
    let [res, operands] = line.split(':')
    operands = operands.trim().split(' ').map(Number)
    res = Number(res)

    const evalRec = (n, operands) => {
        const ops = [...operands]
        if (ops.length === 0) return [n]

        let first = ops[0]
        ops.shift()
        let sum = evalRec(n + first, ops)
        let prod = evalRec(n * first, ops)
        let concat = evalRec(Number((String(n) + String(first))), ops)

        return [...sum, ...prod, ...concat]
    }

    let first = operands[0]
    operands.shift()
    let possibleResults = evalRec(first, operands)

    if (possibleResults.includes(res)) {
        return res
    }
    return 0
}


let main = () => {
    let arr = readInput();
    let sum = 0
    for (const line of arr) {
        sum += sumEquation(line);
    }
    console.log(sum);
}

main();