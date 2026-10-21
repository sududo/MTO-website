const g_canvas = document.getElementById("star-canvas");
const g_canvasCtx = g_canvas.getContext("2d");
const g_stars = [
  starArray("rgba(225, 255, 225, 225)"),
  starArray("rgba(200, 255, 200, 180)"),
  starArray("rgba(180, 235, 180, 150)"),
  starArray("rgba(160, 215, 160, 130)")]

function start(){
  for(let i = 0;i < g_stars.length;i++){
    for(let j = 0;j < 100;j++) g_stars[i].stars.push(star(i));
  }
  animateStars();
}

function starArray(style){
  return {style: style, stars: []};
}

function randNoZero(){
  const rand = Math.random();
  return rand == 0 ? 1 : rand;
}

function randRange(min, max){
  return (randNoZero() * (max - min)) + min;
}

function transformRange(value, min, max){
  return (value * (max - min)) + min;
}

function star(index){
  return {x: randNoZero(), y: randRange(0.8, 1.8), size: transformRange((-index / 3) + 1, 0.001, 0.0025),
      speed: transformRange((-index / 3) + 1, 0.001, 0.002)};
}

function fillRelativeSquare(canvas, ctx, x, y, size){
  const relativeSize = size * Math.sqrt(canvas.width * canvas.height);
  ctx.fillRect(canvas.width * x, canvas.width * y, relativeSize, relativeSize);
}

function animateStars(){
  g_canvas.width = g_canvas.clientWidth;
  g_canvas.height = g_canvas.clientHeight;

  g_canvasCtx.clearRect(0, 0, g_canvas.width, g_canvas.height);
  g_stars.forEach(starsData => {
    g_canvasCtx.fillStyle = starsData.style;
    starsData.stars.forEach(star => {
      star.y -= star.speed;
      fillRelativeSquare(g_canvas, g_canvasCtx, star.x, star.y, star.size);
      if(star.y < 0){
        star.x = randNoZero();
        star.y = randRange(1, 2);
      }
    });
  });
  requestAnimationFrame(animateStars)
}

window.onload = start;
