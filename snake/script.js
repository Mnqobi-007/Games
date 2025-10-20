var gameBoard = document.getElementById("board");
var ctx = gameBoard.getContext("2d");
var width = gameBoard.width;
var height = gameBoard.height;
const unitSize = 25;

//snake head
var snakeHead = {
    x: 100,
    y: 100,
    width: unitSize,
    height: unitSize,
    color: "green"
};

//snake body
var body = [];

//food
var food = {
    x: 200,
    y: 200,
    width: unitSize,
    height: unitSize,
    color: "red"
};

//movement
var left = false;
var right = true; // Start movement
var up = false;
var down = false;

var running = true;
var score = 0;
var gameSpeed = 120;

function createBody(make, moving, snakePart) {
  if (make) {
    let snake = { x: 0, y: 0, width: unitSize, height: unitSize, color: "#2E8B57" };

    switch (moving) {
      case "left":
        snake.x = snakePart.x + unitSize;
        snake.y = snakePart.y;
        break;
      case "right":
        snake.x = snakePart.x - unitSize;
        snake.y = snakePart.y;
        break;
      case "up":
        snake.x = snakePart.x;
        snake.y = snakePart.y + unitSize;
        break;
      case "down":
        snake.x = snakePart.x;
        snake.y = snakePart.y - unitSize;
        break;
    }

    body.push(snake);
  }
}

function drawSnake(){
    // Draw snake head
    ctx.fillStyle = snakeHead.color;
    ctx.fillRect(snakeHead.x, snakeHead.y, snakeHead.width, snakeHead.height);
    
    // Draw eyes
    ctx.fillStyle = "white";
    const eyeSize = unitSize / 5;
    if(right) {
        ctx.fillRect(snakeHead.x + unitSize - eyeSize - 2, snakeHead.y + 5, eyeSize, eyeSize); //left eye
        ctx.fillRect(snakeHead.x + unitSize - eyeSize - 2, snakeHead.y + unitSize - 10, eyeSize, eyeSize); //right eye
    } else if(left) {
        ctx.fillRect(snakeHead.x + 2, snakeHead.y + 5, eyeSize, eyeSize);
        ctx.fillRect(snakeHead.x + 2, snakeHead.y + unitSize - 10, eyeSize, eyeSize);
    } else if(up) {
        ctx.fillRect(snakeHead.x + 5, snakeHead.y + 2, eyeSize, eyeSize);
        ctx.fillRect(snakeHead.x + unitSize - 10, snakeHead.y + 2, eyeSize, eyeSize);
    } else if(down) {
        ctx.fillRect(snakeHead.x + 5, snakeHead.y + unitSize - eyeSize - 2, eyeSize, eyeSize);
        ctx.fillRect(snakeHead.x + unitSize - 10, snakeHead.y + unitSize - eyeSize - 2, eyeSize, eyeSize);
    }
    
    // Draw body parts
    body.forEach(part => {
        ctx.fillStyle = part.color;
        ctx.fillRect(part.x, part.y, part.width, part.height);
    });
}

function drawFood(){
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, food.width, food.height);
    
    ctx.fillStyle = "#FF6B6B";
    ctx.fillRect(food.x + 5, food.y + 5, food.width - 10, food.height - 10);
}

function moveSnake(){
    let oldX = snakeHead.x;
    let oldY = snakeHead.y;
    
    if(left && !right){
        snakeHead.x -= unitSize;
    } else if(right && !left){
        snakeHead.x += unitSize;
    } else if(up && !down){
        snakeHead.y -= unitSize;
    } else if(down && !up){
        snakeHead.y += unitSize;
    }
    
    // Move body parts
    if(body.length > 0){
        for(let i = body.length - 1; i > 0; i--){
            body[i].x = body[i-1].x;
            body[i].y = body[i-1].y;
        }
        body[0].x = oldX;
        body[0].y = oldY;
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (width / unitSize)) * unitSize;
    food.y = Math.floor(Math.random() * (height / unitSize)) * unitSize;
    
    // Check if food spawned on snake
    if(food.x === snakeHead.x && food.y === snakeHead.y) {
        generateFood();
        return;
    }
    
    // Check if food spawned on body
    for(let part of body) {
        if(food.x === part.x && food.y === part.y) {
            generateFood();
            return;
        }
    }
}

function checkFoodCollision(){
    if(snakeHead.x === food.x && snakeHead.y === food.y){
        if(left && !right){
            createBody(true,"left",snakeHead);
        } else if(right && !left){
            createBody(true,"right",snakeHead);
        } else if(up && !down){
            createBody(true,"up",snakeHead);
        } else if(down && !up){
            createBody(true,"down",snakeHead);
        }
        
        generateFood();
        score++;
        
        // Increase speed slightly as score increases
        if(score % 3 === 0 && gameSpeed > 60) {
            gameSpeed -= 5;
        }
    }
}

function checkCollisions(){
    // Wall collision
    if(snakeHead.x < 0 || snakeHead.x >= width || 
       snakeHead.y < 0 || snakeHead.y >= height) {
        running = false;
        drawGameOver();
        return;
    }
    
    // Self collision
    for(let part of body) {
        if(snakeHead.x === part.x && snakeHead.y === part.y) {
            running = false;
            drawGameOver();
            return;
        }
    }
}

function drawScore(){
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}

function drawGameOver(){
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", width/2 - 100, height/2 - 30);
    
    ctx.font = "25px Arial";
    ctx.fillText("Final Score: " + score, width/2 - 80, height/2 + 20);
    
    ctx.font = "20px Arial";
    ctx.fillText("Press Space to Restart", width/2 - 100, height/2 + 60);
}

function resetGame(){
    snakeHead.x = 100;
    snakeHead.y = 100;
    body = [];
    left = false;
    right = true;
    up = false;
    down = false;
    score = 0;
    gameSpeed = 120;
    running = true;
    generateFood();
    window.requestAnimationFrame(main);
}

window.addEventListener("keydown", function(event){
    const key = event.key;
    
    if(!running && key === " ") {
        resetGame();
        return;
    }
    
    switch(key){
        case "ArrowUp":
            if(!down) { 
                up = true;
                left = false;
                right = false;
                down = false;
            }
            break;
        case "ArrowDown":
            if(!up) {
                down = true;
                right = false;
                left = false;
                up = false;
            }
            break;
        case "ArrowLeft":
            if(!right) {
                left = true;
                down = false;
                up = false;
                right = false;
            }
            break;
        case "ArrowRight":
            if(!left) {
                right = true;
                up = false;
                down = false;
                left = false;
            }
            break;
    }
});

function main(){
    if(!running) return;
    
    ctx.clearRect(0, 0, width, height);
    checkFoodCollision();
    moveSnake();
    checkCollisions();
    drawFood();
    drawSnake();
    drawScore();
    
    if(running){
        setTimeout(() => {
            window.requestAnimationFrame(main);
        }, gameSpeed);
    }
}

// Initialize game
generateFood();
window.requestAnimationFrame(main);