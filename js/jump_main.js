 // Game configuration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');



canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Color Enum
const Colors = Object.freeze({
    PLAYER: 'blue',
    OBSTACLE: 'red',
    GROUND: 'green',
    BACKGROUND: '#87CEEB',
    SKY: '#ade2f0'
});

// Game state
const game = {
    score: 0,
    speed: 8,
    difficulty: 1
};

// Player properties
const player = {
    x: 50,
    y: canvas.height - GROUND_HEIGHT,
    width: 140,
    height: 140,
    jumpStrength: 14,
    velocity: 0,
    isJumping: false,
    speed: 5,
    movingLeft: false,
    movingRight: false
};


const playerImage = new Image();
const groundImage = new Image();
playerImage.src = 'imgs/side_koala_big.png';
groundImage.src = 'imgs/ground.png';
// Obstacles array
const obstacles = [];

// game functions
function jump() {
    if (!player.isJumping) {
        player.velocity = -player.jumpStrength;
        player.isJumping = true;
    }
}

// Input handling
canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
    jump();
}, { passive: false });

document.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'Space':
            jump();
            break;
    }
});

// Key release handling
document.addEventListener('keyup', (event) => {
    // switch(event.code) {
    //     case 'ArrowLeft':
    //         player.movingLeft = false;
    //         break;
    //     case 'ArrowRight':
    //         player.movingRight = false;
    //         break;
    // }
});

// Game update logic
function update() {
    // Player horizontal movement
    if (player.movingLeft) {
        player.x -= player.speed;
    }
    if (player.movingRight) {
        player.x += player.speed;
    }

    // Boundary checking
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));

    // Gravity and jumping
    player.velocity += GRAVITY;
    player.y += player.velocity;

    // Ground collision
    if (player.y + player.height >= canvas.height - GROUND_HEIGHT) {
        player.y = canvas.height - GROUND_HEIGHT - player.height;
        player.velocity = 0;
        player.isJumping = false;
    }

    // Spawn obstacles
    spawnObstacle(obstacles, game.difficulty);

    // Update and check obstacles
    const idxToRemove = [];
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update(game);

        // Check for collisions
        if (obstacles[i].intersects(player)) {
            // Game over logic
            alert(`Game Over! Score: ${game.score}`);
            resetGame();
            break;
        }

        // Mark to remove off-screen obstacles
        if (obstacles[i].isOffScreen()) {
            idxToRemove.push(i);
            game.score++;
        }

    }

    // remove obstacles after the loop 
    idxToRemove.reverse().forEach((item, index) => {
        obstacles.splice(index, 1);
    })
}

// Reset game state
function resetGame() {
    obstacles.length = 0;
    game.score = 0;
    game.difficulty = 1;
    game.speed = 8;
    player.x = 50;
    player.y = canvas.height - GROUND_HEIGHT;
}

// Rendering
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Draw sky
    ctx.fillStyle = Colors.SKY;
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw ground
    ctx.fillStyle = Colors.GROUND;
    ctx.drawImage(groundImage, 0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);


    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw obstacles
    obstacles.forEach(obstacle => obstacle.draw(ctx));

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${game.score}`, 10, 30);
}


function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scale = Math.min(windowWidth / CANVAS_WIDTH, windowHeight / CANVAS_HEIGHT);
    
    canvas.style.width = `${CANVAS_WIDTH * scale}px`;
    canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();