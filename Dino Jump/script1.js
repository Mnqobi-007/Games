// === Canvas setup ===
const board = document.getElementById("board");
const ctx = board.getContext("2d");
const width = board.width;
const height = board.height;
const bottomX = 0;
const bottomY = 400;

// === Game variables ===
let gameSpeed = 4;
let frameTimer = 0;
const frameDelay = 10;
let gameOver = false;

// === Dino setup ===
const dino = {
    x: 50,
    y: bottomY - 40,
    w: 30,
    h: 40,
    velocityY: 0
};
const gravity = 0.4;
const jumpStrength = -8;
let dinoStep = false;
let jumping = false;

// === Load Dino images ===
const dinoLeft = new Image();
const dinoRight = new Image();
dinoLeft.src = "./src/Chrome_T-Rex_Left_Run.webp.png";
dinoRight.src = "./src/Chrome_T-Rex_Right_Run.webp.png";

// === Obstacles ===
const obstacle1 = { x: 470, y: bottomY - 35, w: 30, h: 40 };
const obstacle2 = { x: 700, y: bottomY - 35, w: 80, h: 40 };
let obstacles = [obstacle1, obstacle2];

const obstacle1Img = new Image();
const obstacle2Img = new Image();
obstacle1Img.src = "./src/1_Cactus_Chrome_Dino.webp.png";
obstacle2Img.src = "./src/3_Cactus_Chrome_Dino.webp.png";

// === Keyboard input ===
window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        if (gameOver) restartGame();
        else if (dino.y >= bottomY - dino.h) jumping = true;
    }
});

// === Jump logic with gravity ===
function jumpDino() {
    if (jumping) {
        dino.velocityY = jumpStrength;
        jumping = false;
    }
    dino.velocityY += gravity;
    dino.y += dino.velocityY;

    // Stop at ground
    if (dino.y > bottomY - dino.h) {
        dino.y = bottomY - dino.h;
        dino.velocityY = 0;
    }
}

// === Draw Dino ===
function drawDino() {
    const dinoImg = dinoStep ? dinoLeft : dinoRight;
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.w, dino.h);
}

// === Draw obstacles ===
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        const obsImg = obs.w === 30 ? obstacle1Img : obstacle2Img;
        ctx.drawImage(obsImg, obs.x, obs.y, obs.w, obs.h);
    }
}

// === Move obstacles ===
function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;
    }
    // recycle obstacles
    for (let obs of obstacles) {
        if (obs.x + obs.w < 0) {
            obs.x = width + Math.random() * 200;
        }
    }
}

// === Collision detection ===
function checkCollision() {
    for (let obs of obstacles) {
        if (
            dino.x < obs.x + obs.w &&
            dino.x + dino.w > obs.x &&
            dino.y < obs.y + obs.h &&
            dino.y + dino.h > obs.y
        ) {
            gameOver = true;
        }
    }
}

// === Restart game ===
function restartGame() {
    obstacles = [
        { x: 470, y: bottomY - 35, w: 30, h: 40 },
        { x: 700, y: bottomY - 35, w: 80, h: 40 }
    ];
    dino.y = bottomY - dino.h;
    dino.velocityY = 0;
    gameOver = false;
    gameSpeed = 4;
    frameTimer = 0;
    requestAnimationFrame(main);
}

// === Main game loop ===
function main() {
    ctx.clearRect(0, 0, width, height);

    // draw ground
    ctx.fillStyle = "black";
    ctx.fillRect(bottomX, bottomY, width, 2);

    if (!gameOver) {
        // update frame step (leg swap)
        frameTimer++;
        if (frameTimer >= frameDelay) {
            dinoStep = !dinoStep;
            frameTimer = 0;
        }

        // move + draw everything
        moveObstacles();
        drawObstacles();
        jumpDino();
        drawDino();
        checkCollision();

        requestAnimationFrame(main);
    } else {
        // show Game Over text
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", width / 2 - 90, height / 2);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Press SPACE to restart", width / 2 - 110, height / 2 + 40);
    }
}

// === Start the game ===
main();
