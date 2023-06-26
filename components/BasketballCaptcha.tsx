import "../src/BasketballCaptcha.css";

class Ball {
  position: number[] = [0, 0];
  radius: number = 0;
  speed: number[] = [0, 0];

  constructor(x: number, y: number, radius: number) {
    this.position = [x, y];
    this.radius = radius;
  }

  get topEdge(): number {
    return this.position[1] - this.radius;
  }

  get rightEdge(): number {
    return this.position[0] + this.radius;
  }

  get bottomEdge(): number {
    return this.position[1] + this.radius;
  }

  get leftEdge(): number {
    return this.position[0] - this.radius;
  }
}

class Form {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

var canvas: any;
var ctx: CanvasRenderingContext2D;
var canvasWidth = 1000;
var canvasHeight = 500;
var timeLapse = 10;
var gravity = 0.75;
var currentGravity = gravity;
var gravitySpeedLimit = 25;
var bounceCoefficient = 0.5;
var attritionCoefficient = 0.95;

var board: Form = new Form(canvasWidth * 0.9 - 2, canvasHeight * 0.2, 19, 90);
var pole: Form = new Form(
  canvasWidth * 0.9,
  canvasHeight * 0.2 + board.height,
  15,
  400
);
var hoop: Form = new Form(board.x - 75, board.y + board.height - 10, 75, 10);
var hoopEdge: Form = new Form(
  board.x - 75,
  board.y + board.height - 10,
  10,
  10
);
var ball: Ball = new Ball(100, 200, 25);

function getCanvas() {
  if (canvas != null) return;

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.onmousedown = onMouseDown;
  canvas.onmouseup = onMouseUp;

  console.log("Obtained canvas");
}

function clear() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function redraw() {
  getCanvas();

  clear();

  applyMovement();
  applyBounce();
  hoopEscape();

  drawRectangle(pole.x, pole.y, pole.width, pole.height, "#4d4d4d");
  drawRectangle(board.x, board.y, board.width, board.height, "#d8d8d8");
  drawRectangle(hoop.x, hoop.y, hoop.width, hoop.height, "#ec4224");
  drawRectangle(
    hoopEdge.x,
    hoopEdge.y,
    hoopEdge.width,
    hoopEdge.height,
    "#d43519"
  );

  drawCircle(ball.position[0], ball.position[1], ball.radius, "#d49933");
}

function applyMovement() {
  // Speed - Gravity
  let newYSpeed = ball.speed[1] + currentGravity;
  if (newYSpeed > gravitySpeedLimit) newYSpeed = gravitySpeedLimit;

  ball.speed = [ball.speed[0], newYSpeed];

  // Position
  ball.position = [
    ball.position[0] + ball.speed[0],
    ball.position[1] + ball.speed[1],
  ];
}

function applyBounce() {
  // Y - Floor
  if (ball.bottomEdge > canvasHeight) {
    ball.position[1] = canvasHeight - ball.radius;
    ball.speed[1] = -ball.speed[1] * bounceCoefficient;
    ball.speed[0] = ball.speed[0] * attritionCoefficient;
  }

  // Y - Ceiling
  if (ball.topEdge < 0) {
    ball.position[1] = ball.radius;
    ball.speed[1] = -ball.speed[1];
  }

  // X - Left wall
  if (ball.leftEdge < 0) {
    ball.position[0] = ball.radius;
    ball.speed[0] = -ball.speed[0];
  }

  // X - Right wall
  if (ball.rightEdge > canvasWidth) {
    ball.position[0] = canvasWidth - ball.radius;
    ball.speed[0] = -ball.speed[0];
  }

  // X - Board
  if (
    ball.rightEdge > board.x &&
    ball.leftEdge < board.x + board.height &&
    ball.bottomEdge > board.y &&
    ball.topEdge < board.y + board.height
  ) {
    ball.position[0] = board.x - ball.radius;
    ball.speed[0] = -ball.speed[0];
  }
}

function hoopEscape() {}

function drawRectangle(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.closePath();
  ctx.fill();
}

function drawCircle(x: number, y: number, radius: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function onMouseDown(e: MouseEvent) {
  let clickX = e.pageX - canvas.offsetLeft;
  let clickY = e.pageY - canvas.offsetTop;

  if (
    clickX > ball.leftEdge &&
    clickX < ball.rightEdge &&
    clickY > ball.topEdge &&
    clickY < ball.bottomEdge
  ) {
    currentGravity = 0;
    ball.position = [clickX, clickY];
    canvas.onmousemove = onMouseMove;
  }
}

function onMouseUp(e: MouseEvent) {
  canvas.onmousemove = () => {};
  currentGravity = gravity;
}

function onMouseMove(e: MouseEvent) {
  let clickX = e.pageX - canvas.offsetLeft;
  let clickY = e.pageY - canvas.offsetTop;

  ball.speed = [
    (clickX - ball.position[0]) / 2,
    (clickY - ball.position[1]) / 2,
  ];
}

function BasketballCaptcha(props: any) {
  if (!props.ready) return <></>;

  setInterval(redraw, timeLapse);

  return (
    <canvas
      id="canvas"
      className="basketBallCanvas"
      width="1000"
      height="500"
    />
  );
}

export default BasketballCaptcha;
