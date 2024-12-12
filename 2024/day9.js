const fs = require('fs');

let readInput = () => {
    // let res = fs.readFileSync('./input.txt');
    let res = fs.readFileSync('./test-input.txt');
    res = res.toString().split('').map(Number)
    return res;
}

const checksum = (arr) => {
    console.log(arr)
    let res = []
    let id = 0
    for (let i = 0; i < arr.length; i++) {
        if(i%2 === 0)  {
            let count = arr[i] 
            for(let j = 0; j < count; j++) {
                res.push(id)
            }
            id++
        } else {
            let count = arr[i] 
            for(let j = 0; j < count; j++) {
                res.push('.')
            }
        }
    }
    // 00...111...2...333.44.5555.6666.777.888899
    console.log(res.join(''))

    let empty = 0
    let file = res.length -1

    while(empty < file) {
        while(res[empty] !== '.') {
            empty++
        }
        while(res[file] === '.') {
            file--
        }
        res[empty] = res[file]
        res[file] = '.'
        empty++
        file--
    }
    // 0099811188827773336446555566..............
    console.log(res.join(''))
}


let main = () => {
    let arr = readInput();
    let sum = checksum(arr);
    console.log(sum);
}

main();