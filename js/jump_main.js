  // Game configuration
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 800
        canvas.height = 300
        // Color Enum
        const Colors = Object.freeze({
            PLAYER: 'blue',
            OBSTACLE: 'red',
            GROUND: 'green',
            BACKGROUND: '#87CEEB'
        });

        // Game state
        const game = {
            score: 0,
            speed: 6,
            difficulty: 1
        };

        // Player properties
        const player = {
            x: 50,
            y: canvas.height - 50,
            width: 60,
            height: 100,
            jumpStrength: 10,
            velocity: 0,
            isJumping: false,
            speed: 5,
            movingLeft: false,
            movingRight: false
        };


        const playerImage = new Image();
        playerImage.src = 'imgs/side_koala.png'
        // Obstacles array
        const obstacles = [];

        // Obstacle class
        class Obstacle {
            constructor() {
                this.width = 30;
                this.height = 50;
                this.x = canvas.width;
                this.y = canvas.height - this.height - 50; // Ground level
            }

            update() {
                this.x -= game.speed;
            }

            draw() {
                ctx.fillStyle = Colors.OBSTACLE;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }

            isOffScreen() {
                return this.x + this.width < 0;
            }

            // Collision detection
            intersects(player) {
                // some buffer
                return !(
                    player.x + 15> this.x + this.width ||
                    player.x + player.width < this.x + 15 ||
                    player.y + 5> this.y + this.height ||
                    player.y + player.height < this.y +5
                );
            }
        }
        // game functions
        function jump() {
            if (!player.isJumping) {
                player.velocity = -player.jumpStrength;
                player.isJumping = true;
            }
        }

        // Ground properties
        const ground = {
            height: 50
        };

        // Game physics constants
        const GRAVITY = 0.5;

        // Obstacle spawning
        function spawnObstacle() {
            if (obstacles.length <= 3) {
                if (Math.random() < 0.02 * game.difficulty) {
                    obstacles.push(new Obstacle());
                }
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
                case 'ArrowLeft':
                    player.movingLeft = true;
                    break;
                case 'ArrowRight':
                    player.movingRight = true;
                    break;
            }
        });

        // Key release handling
        document.addEventListener('keyup', (event) => {
            switch(event.code) {
                case 'ArrowLeft':
                    player.movingLeft = false;
                    break;
                case 'ArrowRight':
                    player.movingRight = false;
                    break;
            }
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
            if (player.y + player.height >= canvas.height - ground.height) {
                player.y = canvas.height - ground.height - player.height;
                player.velocity = 0;
                player.isJumping = false;
            }

            // Spawn obstacles
            spawnObstacle();

            // Update and check obstacles
            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].update();

                // Remove off-screen obstacles
                if (obstacles[i].isOffScreen()) {
                    obstacles.splice(i, 1);
                    game.score++;
                }

                // Check for collisions
                if (obstacles[i].intersects(player)) {
                    // Game over logic
                    alert(`Game Over! Score: ${game.score}`);
                    resetGame();
                }
            }

            // Gradually increase difficulty
            if (game.score % 10 === 0 && game.score > 0) {
                game.difficulty += 0.1;
                game.speed += 0.1;
            }
        }

        // Reset game state
        function resetGame() {
            obstacles.length = 0;
            game.score = 0;
            game.difficulty = 1;
            game.speed = 3;
            player.x = 50;
            player.y = canvas.height - 50;
        }

        // Rendering
        function render() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw ground
            ctx.fillStyle = Colors.GROUND;
            ctx.fillRect(0, canvas.height - ground.height, canvas.width, ground.height);

            // Draw player
            ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

            // Draw obstacles
            obstacles.forEach(obstacle => obstacle.draw());

            // Draw score
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${game.score}`, 10, 30);
        }

        // Game loop
        function gameLoop() {
            update();
            render();
            requestAnimationFrame(gameLoop);
        }

        // Start the game
        gameLoop();