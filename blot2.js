const width = 125;
const height = 125;
const points = 4;
const pointRadius = 1;
const pointSteps = 60;

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

const pts = []
for (let i=0; i<points; i++) {
  pts.push([bt.rand() * width, bt.rand() * height]);
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
    drawCircle([w, h], ptColors[pts.indexOf(closestPoint)], 0.5)
  }
}

for (const pt of pts) {
  drawCircle(pt, ptColors[pts.indexOf(pt)], 2)
}