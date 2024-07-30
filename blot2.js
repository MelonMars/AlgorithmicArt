const width = 125;
const height = 125;
const points = 8;
const nucleusRadius = 1;
const pointSteps = 60;
const numberMitochondria = 2;
const mitochondriaDistance = 10;
const mitochondriaWidth = 1;
const mitochondriaLength = 2.5;

setDocDimensions(width, height);

function drawCircle(pt, col, r) {
  const ptDrawer = new bt.Turtle()
  const angleStep = 360/pointSteps;
  const forwardStep = 2 * Math.PI * r / pointSteps;
  ptDrawer.up();
  pt[1] = pt[1] - r;
  ptDrawer.goTo(pt);
  ptDrawer.down();

  for (let j=0;j<pointSteps;j++) {
    ptDrawer.forward(forwardStep);
    ptDrawer.right(angleStep);
  }

  drawLines(ptDrawer.lines(), {"fill": col});
}

function drawOval(pt, col, rX, rY) {
  const ptDrawer = new bt.Turtle();
  const pointSteps = 360;
  const angleStep = 360 / pointSteps;
  ptDrawer.up();
  pt[1] = pt[1] - rY;
  ptDrawer.goTo(pt);
  ptDrawer.down();
  
  for (let j = 0; j < pointSteps; j++) {
    const angle = j * angleStep * (Math.PI / 180);
    const x = rX * Math.cos(angle);
    const y = rY * Math.sin(angle);
    
    ptDrawer.goTo([pt[0] + x, pt[1] + y]);
  }
  
  drawLines(ptDrawer.lines());
  const foldDrawer = new bt.Turtle();
  const numFolds = 20;
  const foldLength = rX / 2;
  foldDrawer.up();
  foldDrawer.goTo([pt[0] - rX, pt[1]]);
  foldDrawer.down();
  
  for (let i = 0; i < numFolds; i++) {
    foldDrawer.right(90);
    foldDrawer.forward(foldLength);
    foldDrawer.left(90);
    foldDrawer.forward(2 * rX / numFolds);
    foldDrawer.left(90);
    foldDrawer.forward(foldLength);
    foldDrawer.right(90);
  }
  
  drawLines(foldDrawer.lines())

}


function grahamScan(pts) {
  let stack = []
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  function orientation(p, q, r) {
        return (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  }   
  const lower = [];
    for (const p of pts) {
        while (lower.length >= 2 && orientation(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
            lower.pop();
        }
        lower.push(p);
    }
  const upper = [];
    for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        while (upper.length >= 2 && orientation(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
            upper.pop();
        }
        upper.push(p);
    }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

const pts = []
const lines = []
for (let i=0; i<points; i++) {
  pts.push([bt.rand() * width, bt.rand() * height]);
  lines.push([])
}

const possibleColors = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FFA500",
    "#800080",
    "#00FFFF",
    "#FFC0CB"
];

const ptColors = []
for (let i=0; i<points;i++) {
  const index = bt.randIntInRange(0, possibleColors.length-1);
  ptColors.push(possibleColors[index]);
  possibleColors.splice(index, 1);
}

for (let w=0;w<width;w++) {
  for (let h=0;h<height;h++) {
    let closestPoint = [0,0];
    let closestDistance = 100000000;
    for (const pt of pts) {
      let distance = Math.sqrt((w-pt[0]) ** 2+(h-pt[1]) ** 2)
      if (distance < closestDistance) {
        closestPoint = pt;
        closestDistance = distance;
      }
    }
    lines[pts.indexOf(closestPoint)].push([w,h])
  }
}

for (const tessel of lines) {
  const tess = new bt.Turtle()
  tess.up()
  tess.goTo(tessel[0])
  tess.down()
  for (const pt of grahamScan(tessel)) {
    tess.goTo(pt);
  }
  drawLines(tess.lines())
}

for (let tessel of lines) {
  const tess = new bt.Turtle()
  tess.down()
  tessel = grahamScan(tessel)
  let pts = []
  while (pts.length < numberMitochondria) {
    const i = Math.floor(bt.rand() * tessel.length);
    const p1 = tessel[i];
    const p2 = tessel[(i + 1) % tessel.length];
    const t = bt.rand();
    const dx = p2[0] - p1[0]
    const dy = p2[1] - p1[1]
    const pt = [p1[0] + t * dx, p1[1] + t * dy]
    const len = Math.sqrt(dx * dx + dy * dy)
    const offX = mitochondriaDistance * (dy / len)
    const offY = mitochondriaDistance * (-dx / len)
    const offPt = [pt[0] + offX, pt[1] + offY]
    pts.push(offPt)
    drawOval(offPt, "black", mitochondriaWidth, mitochondriaLength)
  }
}

for (const pt of pts) {
  const r = nucleusRadius;
  const ptDrawer = new bt.Turtle()
  const angleStep = 360/pointSteps;
  const forwardStep = 2 * Math.PI * r / pointSteps;
  ptDrawer.up();
  pt[1] = pt[1] - r;
  ptDrawer.goTo(pt);
  ptDrawer.down();

  for (let j=0;j<pointSteps;j++) {
    ptDrawer.forward(forwardStep);
    ptDrawer.right(angleStep);
  }

  drawLines(ptDrawer.lines());  
}