let s = 15;
let shaded

let gazeX;
let gazeY;

let breath;
let dia;

let focusScale = 1;

let blink = 0;
let blinkDir = 0;
let blinkPro = 0;

let arcAngle = 0;

let smiling = false;

let smileAmt = 0;

let orbit1Ang = 0;
let orbit2Ang = 1;
let orbit3Ang = 3;


function setup() {
  createCanvas(800, 500);
  noStroke();
  background(0);

  gazeX = width / 2;
  gazeY = height / 2;
  shaded = createGraphics(800, 500);
  colorMode(HSB, 360, 100, 100, 255);
  shaded.colorMode(HSB, 360, 100, 100, 255);
}

function draw() {
  //Background adjustment
  let a = map(sin(frameCount / 200), -1, 1, 0, 25);
  fill(0, 0, 0, a);
  rect(0, 0, width, height);

  drawGrid();
  creature();
  drawBlink();

}

function creature() {
  breath = map(sin(frameCount / 40), -1, 1, -20, 20);
  gaze(width / 2, height / 2);
  smile();
  
  shaded.clear();
  drawIris();
  drawPupil();
  drawOrbitals();
  eraseOutside();
  image(shaded, 0, 0)
  
  drawEyelids();

}

function drawOrbitals() {
  
}

function eraseOutside() {
  shaded.erase();
  shaded.noStroke();
  shaded.fill(255);
  
  let ex = width / 2;
  let ey = height / 2;
  
  let lowerLift = smileAmt * 80;
  let upperDrop = smileAmt * 60;
  let cornerLift = smileAmt * 20;

  let right = 600;
  let left = 200;
  
  shaded.beginShape();
  shaded.vertex(0, 0);
  shaded.vertex(width, 0);
  shaded.vertex(right - abs(breath / 9), ey - 130 + breath / 9 - cornerLift);
  shaded.bezierVertex(
    ex - 80,
    ey - 130 + breath + upperDrop,
    ex - 130 + breath,
    ey - 80 + upperDrop,
    left + abs(breath / 9),
    ey + 130 + breath / 9 - cornerLift
  );
  shaded.vertex(0, height);
  shaded.endShape(CLOSE);

  shaded.beginShape();
  shaded.vertex(width, height);
  shaded.vertex(0, height);
  shaded.vertex(left, ey + 130 - cornerLift);
  shaded.bezierVertex(
    ex - 100 - breath,
    ey + 170 -lowerLift * 1.5,
    ex + 170,
    ey + 140 - breath - lowerLift * 1.5,
    right,
    ey - 130 - cornerLift
  );
  shaded.vertex(width, 0);
  shaded.endShape(CLOSE);
  
  shaded.noErase()
  
}

function smile() {
  if (smiling) {
    smileAmt = lerp(smileAmt, 1.0, 0.18);
    if (smileAmt > 0.99) smiling = false
  } else {
        smileAmt = lerp(smileAmt, 0, 0.01);      
  }
  
}
function gaze(ix, iy) {
  let socketR = 82;
  let mouseDist = dist(mouseX, mouseY, ix, iy);
  let targetX;
  let targetY;
  let toMouseX = mouseX - ix;
  let toMouseY = mouseY - iy;

  if (mouseDist < 300) {
    let gazeAng = atan2(toMouseY, toMouseX);
    let gazeBound = min(mouseDist, 300);
    let gazeOff = map(gazeBound, 0, 300, 0, socketR);

    targetX = ix + cos(gazeAng) * gazeOff;
    targetY = iy + sin(gazeAng) * gazeOff;
  } else {
    let drift = noise(frameCount / 500) * TWO_PI * 2;
    let rX = noise(frameCount / 500 + 999) * socketR;
    targetX = ix + cos(drift) * rX;
    targetY = iy + sin(drift) * rX;
  }

  gazeX = lerp(gazeX, targetX, 0.04);
  gazeY = lerp(gazeY, targetY, 0.04);

  // Bound into the socket
  let d = dist(gazeX, gazeY, ix, iy);
  if (d > socketR) {
    let boundAng = atan2(gazeY - iy, gazeX - ix);
    gazeX = ix + cos(boundAng) * socketR;
    gazeY = iy + sin(boundAng) * socketR;
  }
}

function drawIris() {
  shaded.noStroke();
  for (let r = 100; r > -40; r -= 4) {
    // Color gradient;
    let h = map(r, -40, 100, 170, 220);
    let sat = map(r, -40, 100, 90, 60);
    let l = map(r, -40, 100, 95, 70);
    if (mouseIsPressed) {
      h = (h+frameCount) % 350;
    }
    shaded.fill(h, sat, l, 90);
    
    let rd;
    if (r > 96) {
      rd = r + map(sin(frameCount / 50), -1, 1, 40, 80);
    } else {
      rd =
        r +
        map(sin(frameCount / (20 + noise(r / 40) * 30)), -1, 1, 40, 80) +
        noise(r) * 20;
    }

    shaded.circle(gazeX, gazeY, rd);
  }

  //Separate lines
  let sw = 0.2;
  
  for (let r = 100; r > -40; r -= 20) {
    shaded.noFill();
    shaded.stroke(165, 60, 92);
    shaded.strokeWeight(sw);
    sw += 0.2;
    let rd;
    let f = 10
    if (mouseIsPressed) f = 1;
    if (rd > 96) {
      rd = r + map(sin(frameCount / 50), -1, 1, 40, 80);
    } else {
      rd = r +
      map(sin(frameCount / (20 + noise(r / f) * 30)), -1, 1, 40, 80) +
      noise(r) * 20;
    }
      
    shaded.circle(gazeX, gazeY, rd);
  }
  shaded.noStroke();
}

function drawPupil(ix, iy) {
  shaded.noStroke();

  let d = dist(mouseX, mouseY, gazeX, gazeY);
  let baseSize = map(min(d, 200), 0, 200, 30, 60) + breath;
  for (let i = 0; i < 8; i++) {
    let t = i / 7;
    let h = map(t, 0, 1, 210, 60);
    let sat = 80;
    let b = map(t, 0, 1, 60, 5);
    shaded.fill(h, sat, b, 100);
    let scaleP = map(t, 0, 1, 1, 0.05);
    shaded.circle(gazeX, gazeY, baseSize * scaleP);
  }

  //Three arcs
  let speed;
  if (mouseIsPressed) {
    speed = 0.08 * abs(breath) ;
  } else {
    speed = 0.02;
  }
  
  arcAngle += speed;


  shaded.stroke(180, 70, 95, 70);
  shaded.noFill();
  shaded.strokeWeight(2);
  shaded.arc(gazeX, gazeY, baseSize * 0.9, baseSize * 0.9, arcAngle, arcAngle + PI);
  
  shaded.stroke(150, 80, 95, 160);
  shaded.strokeWeight(1.5);
  shaded.arc(gazeX, gazeY, baseSize * 0.55, baseSize * 0.55, arcAngle + TWO_PI / 3, arcAngle + PI + TWO_PI/3);
  
  shaded.stroke(130, 80, 95, 150);
  shaded.strokeWeight(1);
  shaded.arc(gazeX, gazeY, baseSize * 0.35, baseSize * 0.35, arcAngle + TWO_PI / 3 * 2, arcAngle + PI + TWO_PI * 3/2);
  
  shaded.noStroke();
  shaded.fill(20, 100, 100, 100)
  shaded.circle(gazeX, gazeY, baseSize * 0.1)
  
}

function drawEyelids() {
  noFill();

  let ex = width / 2;
  let ey = height / 2;
  
  let lowerLift = smileAmt * 80;
  let upperDrop = smileAmt * 60;
  let cornerLift = smileAmt * 20;
  let cornerDrop = smileAmt * 15;
  

  stroke(25, 90, 100, 100);
  strokeWeight(10);
  bezier(
    200 + abs(breath / 9),
    (ey + 130 + breath / 9 - cornerLift),
    ex - 130 + breath,
    ey - 80 + upperDrop,
    ex - 80,
    ey - 130 + breath + upperDrop,
    600 - abs(breath / 9),
    ey - 130 + breath / 9 - cornerLift
  );
  strokeWeight(5);
  bezier(
    600,
    ey - 130 - cornerLift,
    ex + 170,
    ey + 140 - breath - lowerLift * 1.5,
    ex - 100 - breath,
    ey + 170 - lowerLift * 1.5,
    200,
    ey + 130 - cornerLift
  );

  noFill();
  bezier(
    200 + breath / 2,
    ey + 40 + breath / 2,
    200 + 40 + breath / 2,
    ey - 40 + breath / 2 + cornerDrop,
    200 + 80 + breath/2,
    ey - 90 + breath / 2 + cornerDrop,
    ex - 80 + breath / 4,
    ey - 120 - breath / 4 + cornerDrop
  );
  
  noStroke();
}

function drawBlink() {
  if (blink > 0 && blinkDir == 0) {
    blinkDir = 1;
    blink = 0;
  }

  if (blinkDir == 1) {
    blinkPro = blinkPro + 0.06;
    if (blinkPro >= 1.0) {
      blinkDir = -1;
    }
  } else if (blinkDir == -1) {
    blinkPro = blinkPro - 0.06;
    if (blinkPro <= 0) {
      blinkDir = 0;
      return;
    }
  }

  let lidY = blinkPro * (height / 2);
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, lidY);
  rect(0, height - lidY, width, lidY);
}

function mousePressed() {
  blink++;
  smiling = true;
}


function drawGrid() {
  // Grid generator
  push();
  translate(width / 2, height / 2);
  if (mouseIsPressed) {
    rotate(radians(frameCount));
  }
  rotate(radians(frameCount / 40));
  translate(-width / 2, -height / 2);

  // Fix the mouse location
  let angle = radians(frameCount / 40);
  if (mouseIsPressed) {
    angle += radians(frameCount);
  }

  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  let gridMouseX = mx * cos(-angle) - my * sin(-angle) + width / 2;
  let gridMouseY = mx * sin(-angle) + my * cos(-angle) + height / 2;

  for (let x = -250; x < width + 250; x += s) {
    for (let y = -250; y < height + 250; y += s) {
      //Color setup
      let noiseVal = noise(
        x / 500 + frameCount / 200,
        y / 500 + frameCount / 200
      );
      fill(map(noiseVal, 0, 1, 100, 360), 100, 100, 250);

      //Flicker
      let flicker = noise(x / 200, y / 200, sin(frameCount / 40));
      let r = map(flicker, 0, 1, 0, 5);

      // Grid gittering
      let jx = noise(x * 0.3, y * 0.3) * s * 3;
      let jy = noise(x * 0.3 + 200, y * 0.3 + 200) * s * 3;

      let cx = x + jx;
      let cy = y + jy;

      // Mouse Interaction
      let dis = dist(cx, cy, gridMouseX, gridMouseY);

      if (dis < 50) {
        // Target
        let tx = gridMouseX + noise(x, y, frameCount / 30) * 20;
        let ty = gridMouseY + noise(x + 999, y + 999, frameCount / 30) * 20;

        // Pull t with 50% dist
        let t = map(dis, 50, 0, 0, 0.5);

        // Lerp
        cx = lerp(cx, tx, t);
        cy = lerp(cy, ty, t);

        //Color cluster
        let baseHue = map(noiseVal, 0, 1, 100, 360);
        let compHue = (baseHue + 180) % 360;
        let hueShift = map(dis, 50, 0, baseHue, compHue);
        fill(hueShift, 100, 100, 255);
      }

      circle(cx, cy, r);
    }
  }
  pop();
}