const ObstacleTypes = Object.freeze({
    WOMBAT: { image: "imgs/wombat.png", height: 95, width: 75, y: 0},
    DEADTREE: { image: "imgs/dead_tree.png", height: 128, width: 128, y:0},
    LIVETREE: { image: "imgs/greentree.png", height: 120, width: 100, y:0},
    BIRD: { image: "imgs/bird.png", height: 50, width: 50, y: -50},
    KOALA: { image: "imgs/fake_derpy.png", height: 100, width: 80, y:0}
})


function computeAddSpeed(game) {
    return Math.min(game.score / 10, 8);
}

// Obstacle class
class Obstacle {
    constructor(obstacleType) {
        this.x = canvas.width;
        this.y = canvas.height - obstacleType.height - GROUND_HEIGHT + obstacleType.y + 5;
        this.obstacleType = obstacleType;
        this.obstacleImage = new Image();
        this.obstacleImage.src = obstacleType.image;
        // between -3 and 3
        this.obstacleSpeedVariation = Math.random() * 6 - 3;
    }

    update(game) {
        this.x -= game.speed + computeAddSpeed(game) + this.obstacleSpeedVariation;
    }

    draw(ctx) {
        // Draw player
        ctx.drawImage(
            this.obstacleImage,
            this.x,
            this.y,
            this.obstacleType.width,
            this.obstacleType.height);
    }

    isOffScreen() {
        return this.x + this.obstacleType.width < 0;
    }

    // Collision detection
    intersects(player) {
        // some buffer
        return !(
            player.x + 15> this.x + this.obstacleType.width ||
            player.x + player.width < this.x + 15 ||
            player.y + 5> this.y + this.obstacleType.height ||
            player.y + player.height < this.y +5
        );
    }
}


// returns ObstacleType to spawn.
function chooseObstacleType() {
    rand = Math.random();
    if (rand < 0.3) {
        return ObstacleTypes.DEADTREE;
    }
    else if (rand < 0.5) {
        return ObstacleTypes.BIRD;
    }
    else if (rand < 0.7) {
        return ObstacleTypes.LIVETREE;
    }
    else if (rand < 0.9) {
        return ObstacleTypes.WOMBAT;
    }
    else {
        return ObstacleTypes.KOALA;
    }
}

// Obstacle spawning
function spawnObstacle(obstacleList, gameDifficulty) {
    if (obstacleList.length < MAX_OBSTACLE_NUM) {
        if (Math.random() < 0.02 * gameDifficulty) {
            obstacleList.push(new Obstacle(chooseObstacleType()));
        }
    }
}
