import { useState } from "react";
import "../BasketballCaptcha.css";
import HackerText from "./HackerText";

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
var scoringPosition = false;
var score = 0;
var timeLeft = 20;
var readyToScore = true;
var retractDistance = 100;
var trapScore = 2;
var canvasWidth = 1000;
var canvasHeight = 750;
var timeLapse = 10;
var gravity = 0.75;
var currentGravity = gravity;
var gravitySpeedLimit = 25;
var speedLimit = 25;
var bounceCoefficient = 0.5;
var attritionCoefficient = 0.95;
var initialHoopX: number;
var finalRetractedHoopX: number;

var board: Form = new Form(canvasWidth * 0.9 - 2, canvasHeight * 0.35, 19, 90);
var pole: Form = new Form(
  canvasWidth * 0.9,
  canvasHeight * 0.35 + board.height,
  15,
  400
);
var hoop: Form = new Form(board.x - 75, board.y + board.height - 10, 75, 10);
var ball: Ball = new Ball(100, 200, 25);

function getCanvas() {
  if (canvas != null) return;

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.onmousedown = onMouseDown;
  canvas.onmouseup = onMouseUp;

  initialHoopX = hoop.x;
  finalRetractedHoopX = initialHoopX + 100;
}

function clear() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function redraw() {
  getCanvas();

  clear();

  applyMovement();
  applyBounce();
  checkPoint();
  retractHoop();

  drawText(`Score: ${score}`, 25, 50, "40px Helvetica", "#aaaaaa");
  drawText(`Time: ${timeLeft}s`, 800, 50, "40px Helvetica", "#aaaaaa");

  drawRectangle(pole.x, pole.y, pole.width, pole.height, "#4d4d4d");
  drawRectangle(board.x, board.y, board.width, board.height, "#d8d8d8");
  drawRectangle(hoop.x, hoop.y, hoop.width, hoop.height, "#ec4224");

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
    readyToScore = true;
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
    ball.speed[0] = -ball.speed[0] * 0.25;
  }
}

function checkPoint() {
  if (scoringPosition && ballBelowHoop() && score < trapScore && readyToScore) {
    score++;
    readyToScore = false;
  }

  if (ballAboveHoop()) scoringPosition = true;
  else scoringPosition = false;
}

function ballAboveHoop(): boolean {
  return (
    ball.position[0] >= hoop.x &&
    ball.position[0] <= hoop.x + hoop.width &&
    ball.position[1] <= hoop.y &&
    ball.position[1] >= hoop.y - 25
  );
}

function ballBelowHoop(): boolean {
  return (
    ball.position[0] >= hoop.x &&
    ball.position[0] <= hoop.x + hoop.width &&
    ball.position[1] <= hoop.y + 25 &&
    ball.position[1] >= hoop.y
  );
}

function retractHoop() {
  if (
    score == trapScore &&
    readyToScore &&
    distanceBetween(ball.position, [board.x, board.y + board.height]) <
      retractDistance
  )
    if (hoop.x > finalRetractedHoopX) {
      hoop.x = hoop.x + 20;
    } else {
      hoop.x = finalRetractedHoopX;
    }
  else {
    if (hoop.x > initialHoopX) {
      hoop.x = hoop.x - 1;
    } else {
      hoop.x = initialHoopX;
    }
  }
}

function distanceBetween(a: number[], b: number[]): number {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

function drawText(
  content: string,
  x: number,
  y: number,
  font: string,
  color: string
) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.fillText(content, x, y);
}

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

  if (distanceBetween([clickX, clickY], ball.position) < 10) {
    ball.speed = [0, 0];
    return;
  }

  ball.speed = [
    (clickX - ball.position[0]) / 2,
    (clickY - ball.position[1]) / 2,
  ];

  let speedMagnitude = getBallSpeedMagnitude();
  if (speedMagnitude > speedLimit) {
    let coefficient = speedMagnitude / speedLimit;
    ball.speed = [ball.speed[0] / coefficient, ball.speed[1] / coefficient];
  }
}

function getBallSpeedMagnitude(): number {
  return Math.sqrt(Math.pow(ball.speed[0], 2) + Math.pow(ball.speed[1], 2));
}

function BasketballCaptcha(props: any) {
  if (!props.ready) return <></>;

  const [timesUp, setTimesUp] = useState(false);

  function tickTimer() {
    timeLeft--;

    if (timeLeft == 0) setTimesUp(true);
  }

  setInterval(tickTimer, 1000);

  if (timesUp)
    return (
      <HackerText
        stopText={false}
        messages={["Time's up, robot"]}
        onEndEvent={() => {}}
      />
    );

  setInterval(redraw, timeLapse);

  return (
    <canvas
      id="canvas"
      className="basketBallCanvas"
      width="1000"
      height="750"
    />
  );
}

export default BasketballCaptcha;
