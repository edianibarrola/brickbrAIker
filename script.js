const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 100;
const paddleHeight = 10;
const brickRowCount = 5;
const brickColumnCount = 10;
const brickWidth = 70;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('touchstart', touchStartHandler);
document.addEventListener('touchmove', touchMoveHandler);
document.addEventListener('touchend', touchEndHandler);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
  if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
  if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
}

function touchStartHandler(e) {
  e.preventDefault();
  let touch = e.touches[0];
  let touchX = touch.clientX - canvas.offsetLeft;

  if (touchX > paddleX - 10 && touchX < paddleX + paddleWidth + 10) {
    leftPressed = false;
    rightPressed = false;
  }
}

function touchMoveHandler(e) {
  e.preventDefault();
  let touch = e.touches[0];
  let touchX = touch.clientX - canvas.offsetLeft;

  if (touchX > paddleX - 10 && touchX < paddleX + paddleWidth + 10) {
    paddleX = touchX - paddleWidth / 2;
  }
}

function touchEndHandler(e) {
  e.preventDefault();
  leftPressed = false;
  rightPressed = false;
}

function checkGameOver() {
    let allBricksDestroyed = true;
  
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          allBricksDestroyed = false;
          break;
        }
      }
      if (!allBricksDestroyed) break;
    }
  
    if (allBricksDestroyed) {
      alert('Congratulations! You have destroyed all the bricks!');
      document.location.reload();
      clearInterval(interval);
    }
  }
  
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#808080';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#808080';
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        let b = bricks[c][r];
        if (b.status === 1) {
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            dy = -dy;
            b.status = 0;
          }
        }
      }
    }
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
  
    if (x + dx > canvas.width - 10 || x + dx < 10) {
      dx = -dx;
    }
  
    if (y + dy < 10) {
      dy = -dy;
    } else if (y + dy > canvas.height - 10) {
      if (x > paddleX - 10 && x < paddleX + paddleWidth + 10) {
        dy = -dy;
      } else {
        alert('GAME OVER');
        document.location.reload();
        clearInterval(interval);
      }
    }
  
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
  
    x += dx;
    y += dy;
    checkGameOver();
  }
  
  let interval = setInterval(draw, 10);
  