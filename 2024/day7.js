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
    // console.log(res, operands)

    const evalRec = (n, operands) => {
        const ops = [...operands]
        if (ops.length === 0) return [n]

        let b = ops[0]
        ops.shift()
        let sum = evalRec(n + b, ops)
        let prod = evalRec(n * b, ops)

        return [...sum, ...prod]
    }

    if(operands.length === 1) {
        throw new Error("not enough operands")
        // return res === operands[0]
    }

    let first = operands[0]
    operands.shift()
    let possibleResults = evalRec(first, operands)
    
    if(possibleResults.includes(res)) {
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