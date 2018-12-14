
let matches = (recipes, pattern) => {
    if (recipes.length < pattern.length) {
        return false;
    }

    let tail = recipes.slice(- pattern.length);
    return tail.join('') === pattern;
}

let main = () => {
    const PATTERN = '765071';

    let recipes = [3, 7];

    let elf1 = 0;
    let elf2 = 1;

    while (true) {
        let recipe1 = recipes[elf1];
        let recipe2 = recipes[elf2];
        let sum = recipe1 + recipe2;
        if (sum > 9) {
            recipes.push(Math.floor(sum / 10));
            if (matches(recipes, PATTERN)) {
                break;
            }
            recipes.push(sum % 10);
            if (matches(recipes, PATTERN)) {
                break;
            }
        } else {
            recipes.push(sum);
            if (matches(recipes, PATTERN)) {
                break;
            }
        }

        // Move elves
        elf1 = (elf1 + 1 + recipe1) % recipes.length;
        elf2 = (elf2 + 1 + recipe2) % recipes.length;
    }

    console.log(recipes.length - PATTERN.length);
    // 51589 after 9
    // 59414 after 2018
}


main();