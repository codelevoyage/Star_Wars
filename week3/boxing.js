// Initial setup
let player1 = {
    name: "Player 1",
    health: 100,
};

let player2 = {
    name: "Player 2",
    health: 100,
};

let currentPlayer = player1;

// Function to generate random damage
function generateDamage() {
    return Math.floor(Math.random() * 10) + 1;
}

// Function to apply damage to the opponent
function applyDamage(opponent, damage) {
    if (damage < 6) {
        console.log(`${currentPlayer.name} lands a basic hit on ${opponent.name}!`);
    } else if (damage >= 6 && damage <= 9) {
        console.log(`${currentPlayer.name} lands a critical hit on ${opponent.name}!`);
    } else {
        console.log(`${currentPlayer.name} lands a KNOCKOUT on ${opponent.name}!🥊`);
    }
    
    opponent.health -= damage;
    
    if (opponent.health < 0 || damage === 10) {
        // Ensure health doesn't go below 0 and automatic KO if damage is 10
        opponent.health = 0;
    }

    console.log(`${opponent.name}'s health is now ${opponent.health}.`);
}

// Function to check if the game is over
function checkKnockout(opponent) {
    if (opponent.health <= 0) {
        console.log(`${opponent.name} has been knocked out!`);
        console.log(`${currentPlayer.name} is the WINNER! 🏆`);
        return true;
    }
    return false;
}

// Function to switch turns
function switchTurns() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    console.log(`It's now ${currentPlayer.name}'s turn.`);
}

// Main gameplay function
function playTurn() {
    let opponent;
    if (currentPlayer === player1) {
        opponent = player2;
    } else {
        opponent = player1;
    }

    const damage = generateDamage();
    applyDamage(opponent, damage);

    if (checkKnockout(opponent)) {
        return false;
    }
    
    switchTurns();
    return true;
}

// Game loop
function startGame() {
    console.log("Starting the Boxing Game!");
    console.log(`${player1.name} vs ${player2.name}`);
    
    while (player1.health > 0 && player2.health > 0) {
        if (!playTurn()) break;
    }
    
    console.log("Game Over. Thanks for playing!");
}


startGame();
