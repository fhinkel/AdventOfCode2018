
let main = () => {
    const NUMBER_OF_RECIPES = 765071;

    let recipes = [3, 7];
    
    let elf1 = 0;
    let elf2 = 1;
    
    while (recipes.length < NUMBER_OF_RECIPES + 10) {
        let recipe1 = recipes[elf1];
        let recipe2 = recipes[elf2];
        let sum = recipe1 + recipe2;
        if (sum > 9) {
            recipes.push(Math.floor(sum / 10));
            recipes.push(sum % 10);
        } else {
            recipes.push(sum);
        }
        
        // move elves
        elf1 = (elf1 + 1 + recipe1) % recipes.length;
        elf2 = (elf2 + 1 + recipe2) % recipes.length;
    }
    
    let score = recipes.slice(NUMBER_OF_RECIPES, NUMBER_OF_RECIPES + 10);
    console.log(score.join(''));
    //51589 after 9
}


main();