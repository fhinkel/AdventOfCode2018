const fs = require('fs');

let readInput = () => {
    let res = fs.readFileSync('./input.txt');
    // let res = fs.readFileSync('./test-input.txt');
    res = res.toString().split('\n').map(line => line.trim())
    const index = res.indexOf("")
    const orders = res.slice(0, index).map(s => s.split("|").map(Number))
    const updates = res.slice(index + 1).map(s => s.split(",").map(Number))
    return [orders, updates];
}

const sumPages = (orders, updates) => {
    // 47|53
    // 97|13
    // 97|61

    // 75,47,61,53,29
    // 53 47
    const m = new Map();
    // key: second
    // value: array of those allowed first
    for (const [first, second] of orders) {
        if (!m.has(second)) {
            m.set(second, [first])
        } else {
            m.get(second).push(first)
        }
    }

    const compareFn = (a, b) => {
        // > 0 	sort a after b, e.g. [b, a]   
        if (m.has(a)) {
            if ((m.get(a)).indexOf(b) !== -1) {
                // a > b
                return 1;
            }
        }
        // a < b
        return -1
    }

    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time 
        if (this.length != array.length)
            return false;
        for (let i = 0, l = this.length; i < l; i++) {
            // Check
            if (this[i] != array[i])
                return false;
        }
        return true;

    }

    let sum = 0
    for (const update of updates) {
        let unsorted = [...update]
        update.sort(compareFn)
        if (!unsorted.equals(update)) {
            const l = update.length
            sum += update[Math.floor(l / 2)]
        }
    }

    return sum
}

let main = () => {
    let [orders, updates] = readInput();
    let sum = sumPages(orders, updates);
    console.log(sum);
}

main();