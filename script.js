const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let lastX = 0,
  lastY = 0;
let penType = "pawprint";
let firstDraw = true; // Track first drawing action

// Load the images for the canvas
const pawPrintImg = new Image();
pawPrintImg.src = "img/pawprints.png";

const castleImg = new Image();
castleImg.src = "img/castle.png";

const sandImage = new Image();
sandImage.src = "img/sand-texture.jpeg";

// Resize canvas for mobile and desktop
function resizeCanvas() {
  const isMobile = window.innerWidth <= 800;
  if (isMobile) {
    canvas.height = window.innerHeight - 50;
  }
}

resizeCanvas();

sandImage.onload = function () {
  ctx.drawImage(sandImage, 0, 0, canvas.width, canvas.height);
};

function setPen(type) {
  penType = type;
}

function startDrawing(e) {
  e.preventDefault();

  drawing = true;
  if (e.type === "pointerdown" || e.type === "mousedown") {
    [lastX, lastY] = [e.offsetX, e.offsetY];
  } else if (e.type === "touchstart") {
    const touch = e.touches[0];
    [lastX, lastY] = [touch.clientX, touch.clientY];
  }

  if (penType === "sand") {
    drawInSand(e);
  } else if (penType === "eraser") {
    erase(e);
  } else if (penType === "pawprint") {
    drawPawPrint(e);
  } else if (penType === "castle") {
    drawCastle(e);
  }
}

function draw(e) {
  e.preventDefault();

  if (!drawing) return;

  if (penType === "sand") {
    drawInSand(e);
  } else if (penType === "eraser") {
    erase(e);
  } else if (penType === "pawprint") {
    drawPawPrint(e);
  } else if (penType === "castle") {
    drawCastle(e);
  }
}

function drawInSand(e) {
  const brushSize = 40;
  const scatterAmount = 10;

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";

  for (let i = 0; i < scatterAmount; i++) {
    const offsetX = (Math.random() - 0.5) * brushSize;
    const offsetY = (Math.random() - 0.5) * brushSize;
    ctx.beginPath();
    ctx.arc(e.offsetX + offsetX, e.offsetY + offsetY, 3, 0, Math.PI * 2, false);
    ctx.fill();
  }
}

function drawCastle(e) {
  const castleSpacing = 120;
  const randomSize = Math.floor(Math.random() * 100) + 50;

  if (firstDraw) {
    ctx.globalAlpha = 1.0;
    ctx.drawImage(
      castleImg,
      e.offsetX - randomSize / 2,
      e.offsetY - randomSize / 2,
      randomSize,
      randomSize
    );

    lastX = e.offsetX;
    lastY = e.offsetY;

    firstDraw = false;
  } else {
    if (Math.hypot(e.offsetX - lastX, e.offsetY - lastY) > castleSpacing) {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(
        castleImg,
        e.offsetX - randomSize / 2,
        e.offsetY - randomSize / 2,
        randomSize,
        randomSize
      );

      lastX = e.offsetX;
      lastY = e.offsetY;
    }
  }
}

function drawPawPrint(e) {
  const pawPrintSpacing = 100;

  if (firstDraw) {
    ctx.globalAlpha = 1.0;
    ctx.drawImage(pawPrintImg, e.offsetX - 70, e.offsetY - 70, 100, 100);

    lastX = e.offsetX;
    lastY = e.offsetY;

    firstDraw = false;
  } else {
    if (Math.hypot(e.offsetX - lastX, e.offsetY - lastY) > pawPrintSpacing) {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(pawPrintImg, e.offsetX - 70, e.offsetY - 70, 100, 100);

      lastX = e.offsetX;
      lastY = e.offsetY;
    }
  }
}

function erase(e) {
  ctx.globalAlpha = 1.0;

  const x =
    e.type === "pointermove" || e.type === "mousemove"
      ? e.offsetX
      : e.touches[0].clientX;
  const y =
    e.type === "pointermove" || e.type === "mousemove"
      ? e.offsetY
      : e.touches[0].clientY;

  ctx.clearRect(x - 40, y - 40, 40, 40);
}

function stopDrawing() {
  drawing = false;
  ctx.globalAlpha = 1.0;
  firstDraw = true;
}

window.addEventListener("resize", resizeCanvas);

// Pointer events for desktop
canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointerout", stopDrawing);

// Mouse events as fallback for desktop
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Touch events for mobile
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

// Button Styling
const buttons = document.querySelectorAll(".toolbar button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
  });
});
