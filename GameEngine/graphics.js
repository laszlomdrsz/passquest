function drawCircle(ctx, x, y, rad, color){
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }
  
function drawRect(ctx, x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawLine(ctx, x1, y1, x2, y2, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 15;
  ctx.stroke();
}

function drawImageCentered(ctx, img, x, y, width, height) {
  const dx = x - width / 2;
  const dy = y - height / 2;
  ctx.drawImage(img, dx, dy, width, height);
}

function imgUrlToImg(url) {
  const img = new Image();
  img.src = url;
  return img;
}

function imgUrlToPattern(ctx, url) {
  const img = new Image();
  img.src = url;
  const pattern = ctx.createPattern(img, 'repeat');
  return pattern;
}