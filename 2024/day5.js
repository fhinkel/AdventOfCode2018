const { error } = require('console');
const { UV_UDP_REUSEADDR } = require('constants');
const fs = require('fs');

let readInput = () => {
    let res = fs.readFileSync('./input.txt');
    // let res = fs.readFileSync('./test-input.txt');
    res = res.toString().split('\n').map(line => line.trim())
    const index = res.indexOf("")
    const orders = res.slice(0, index).map(s=>s.split("|").map(Number))
    const updates = res.slice(index + 1).map(s=>s.split(",").map(Number))
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

    // console.log(m)

    const isValidUpdate = (update) => {
        const n = update.length;
        for (let i = 1; i < n; i++) {
            const second = update[i]
            for (let j = 0; j < i; j++) {
                const first = update[j]
                if (m.has(first)) {
                    let befores = m.get(first)
                    if (befores.indexOf(second) !== -1) {
                        // 75,97,47,61,53
                        // 97|75
                        return false
                    }
                }
            }
        }
        // console.log(update);
        return true
    }

    const validUpdates = []
    for (const update of updates) {
        if (isValidUpdate(update)) {
            validUpdates.push(update)
        }
    }

    let sum = 0
    for (const update of validUpdates) {
        const l = update.length
        if (l % 2 === 0) {
            console.log(l, update);
            throw new Error("even length can't cope")
        }
        sum += update[Math.floor(l / 2)]
    }

    return sum
}

let main = () => {
    let [orders, updates] = readInput();
    let sum = sumPages(orders, updates);
    console.log(sum);
}

main();