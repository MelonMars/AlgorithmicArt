/*
@title: CyberCity
@author: MelonMars
@snapshot: snapshot1.png
*/

const blockWidth = 50; //Width of a block
const blockHeight = 70; //Height of a block
const nBlocks = 5; // Number of blocks on each row and height
const streetSize = 20; //Thickness of the street
const screenHeight = nBlocks * (blockHeight + streetSize);
const screenWidth = nBlocks * (blockWidth + streetSize);
const carHeight = 1; //Height of each car
const carLength = 10; //Length of each car
const nCars = 0 //Number of cars, similar to number of blocks
const stripeFac = 10; //Stripe factor for crosswalks
const extraGap = 0; //Extra gap between stripes of crosswalk
const crossWalkSize = 5; //Length of crosswalk
const laneDashes = 20; //Amount of dashes per lane
const laneSpacing = 5; //Amount of space between dashes
const nLanes = 3; //Amount of lanes
const skyScraperChance = 0.3
const skyScraperJumps = 5 // How many tiers you want in your tiered skyscraper
const skyScraperReductionFactor = 0.4;
const colorCars = false
const colorBuildings = false
const colorBackground = true
const sidewalkWidth = 5; //Also increases the width of the skyscrapers
const stuff = 2; //Amount of random stuff to put on each block
const lChance = 0.5; //Chance that the random thing on the block will be an L shaped polygon or not
const maxStuffLength = 10; //Max stuff length (MUST BE LESS THAN THE SIZE OF THE BLOCK)
const minStuffLength = 5; //Minimum stuff length (>0)
const voronoiBackground = true;
const voronoiPoints = 5;
setDocDimensions(screenWidth, screenHeight);

function getRandElem(arr) {
  const randI = Math.floor(bt.randInRange(0,1) * arr.length);
  return arr[randI].slice();
}

function makeBlock(startPos, bw, bh) {
  const blk = new bt.Turtle()
  blk.up()
  blk.goTo(startPos)
  blk.down()
  blk.forward(bw)
  blk.left(90)
  blk.forward(bh)
  blk.left(90)
  blk.forward(bw)
  blk.left(90)
  blk.forward(bh)
  
  return (blk.lines())
}

function makeCar(startPos, carL, carH) {
  const car = new bt.Turtle()
  car.up()
  car.goTo(startPos)
  car.down()
  car.forward(carL)
  car.left(90)
  car.forward(carH)
  car.left(90)
  car.forward(carL)
  car.left(90)
  car.forward(carH)
  return (car.lines())  

}

function drawLanes(bw, bh, streetSize, i, spaceI) {
  if (spaceI != nLanes) {
    const lw = new bt.Turtle(); 
    const spacing = streetSize / nLanes;
    lw.up();
    i+=1;
    lw.goTo([(bw*i)+(i*streetSize)-(spaceI*spacing), 0]);
    lw.left(90);
    lw.down();
    for (let i=0; i<laneDashes; i++) {
      lw.forward((screenHeight/laneDashes)-laneSpacing);
      lw.up();
      lw.forward(laneSpacing);
      lw.down();
    }
    lw.up()
    lw.goTo([0, (bh*i)+(i*streetSize)-(spaceI*spacing)]);
    lw.down();
    lw.right(90);
    for (let i=0; i<laneDashes; i++) {
      lw.forward((screenWidth/laneDashes)-laneSpacing);
      lw.up();
      lw.forward(laneSpacing);
      lw.down();
    }
    lw.up();
    return lw.lines();
  }
}

function calcPerim(lines) {
  let totLen = 0;
  for (let i = 0; i < lines.length; i++) {
        let points = lines[i];
        let length = 0;

        for (let j = 0; j < points.length - 1; j++) {
            let x1 = points[j][0];
            let y1 = points[j][1];
            let x2 = points[j + 1][0];
            let y2 = points[j + 1][1];

            length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }

        totLen += length;
    }

    return totLen;
}

function drawCrosswalks(startPos, bw, bh, streetSize) {
  const cw = new bt.Turtle();
  const crosswalkWidth = streetSize;
  const stripeWidth = crosswalkWidth / stripeFac;
  const gapWidth = stripeWidth; 

  for (let i = 0; i <= bw; i += bw + streetSize) {
    for (let j = 0; j < crosswalkWidth; j += stripeWidth + gapWidth) {
      cw.up();
      cw.goTo([startPos[0] + i, startPos[1] - j]);
      cw.down();
      cw.forward(crossWalkSize);
      cw.up();
      cw.forward(bw - (2 * crossWalkSize));
      cw.down();
      cw.forward(crossWalkSize);
    }
  }

  const verticalPositions = [0, bw + (0.75 * streetSize)];
  for (let pos of verticalPositions) {
    for (let l = 0; l < crosswalkWidth; l += stripeWidth + gapWidth) {
      cw.up();
      cw.goTo([startPos[0] - l, startPos[1] + pos]);
      cw.down();
      cw.left(90);
      cw.forward(crossWalkSize);
      cw.right(90);
    }
  }


  return cw.lines();
}
const crosswalks = []
const blocks = []
const lanes = []
const polys = []
for (let blkVert = 0; blkVert < nBlocks; blkVert++) {
  for (let blkHor = 0; blkHor < nBlocks; blkHor++) {
    let startPos = [blkHor * (blockWidth + streetSize), blkVert * (blockHeight + streetSize)]
    if (bt.randInRange(0, 1) < skyScraperChance) {
      let startPos = [blkHor * (blockWidth + streetSize), blkVert * (blockHeight + streetSize)];
      let currentW = blockWidth;
      let currentH = blockHeight;

      for (let jump = 0; jump < skyScraperJumps; jump++) {
        blocks.push(makeBlock(startPos, currentW, currentH));

        const wRed = currentW * skyScraperReductionFactor;
        const hRed = currentH * skyScraperReductionFactor;

        currentW -= wRed;
        currentH -= hRed;

        startPos[0] += wRed / 2;
        startPos[1] += hRed / 2;
      }
    } else {
      blocks.push(makeBlock([blkHor * (blockWidth + streetSize), blkVert * (blockHeight + streetSize)], blockWidth, blockHeight));
      for (let i=0;i<stuff;i++) {
        if (bt.randInRange(0,1) < lChance) {
          const rt = new bt.Turtle();
          rt.up();
          const width = bt.randInRange(minStuffLength, maxStuffLength);
          const height = bt.randInRange(minStuffLength, maxStuffLength);
          rt.goTo([bt.randInRange(blkHor * (blockWidth + streetSize), blkHor * (blockWidth + streetSize) + blockWidth-width), bt.randInRange(blkVert * (blockHeight + streetSize), blkVert * (blockHeight + streetSize)+blockHeight-height)]);
          rt.down();
          rt.forward(width);
          rt.left(90);
          rt.forward(height/2);
          rt.left(90);
          rt.forward(width/2);
          rt.right(90);
          rt.forward(height/2);
          rt.left(90);
          rt.forward(width/2);
          rt.left(90);
          rt.forward(height);
          polys.push(rt.lines());
        } else {
          const rt = new bt.Turtle();
          rt.up();
          const width = bt.randInRange(minStuffLength, maxStuffLength);
          const height = bt.randInRange(minStuffLength, maxStuffLength);
          rt.goTo([bt.randInRange(blkHor * (blockWidth + streetSize), blkHor * (blockWidth + streetSize) + blockWidth-width), bt.randInRange(blkVert * (blockHeight + streetSize), blkVert * (blockHeight + streetSize)+blockHeight-height)]);
          rt.down();
          rt.forward(width);
          rt.left(90);
          rt.forward(height);
          rt.left(90);
          rt.forward(width);
          rt.left(90);
          rt.forward(height);
          polys.push(rt.lines());
        }
      }
    }
    crosswalks.push(drawCrosswalks(startPos, blockWidth, blockHeight, streetSize));
  }
}

for (let i = 1; i < nLanes; i++) {
  for (let laneI = 0; laneI < nBlocks; laneI++) {
    lanes.push(drawLanes(blockWidth, blockHeight, streetSize, laneI, i));
  }
}
function insideBlock(x, y) {
  const colI = Math.floor(x / (blockWidth + streetSize))
  const rowI = Math.floor(y / (blockHeight + streetSize))
  const lclX = x % (blockWidth + streetSize)
  const lclY = y % (blockHeight + streetSize)

  return (lclX < blockWidth) && (lclY < blockHeight)
}

function allPtsAllowed(pts, alloPts) {
  for (let pt of pts) {
    if (!alloPts.some(allowPt => alloPts[0] === pt[0] && alloPts[1] === pt[1])) {
      return false;
    }
  }
  return true;
}

const ptsOutBlk = []
const ptsInBlk = []
for (let x = 0; x < screenWidth; x++) {
  for (let y = 0; y < screenHeight; y++) {
    if (insideBlock(x, y)) {
      ptsInBlk.push(
        [x, y]
      )
    } else {
      ptsOutBlk.push(
        [x, y]
      )
    }
  }
}

const cycleWidth = blockWidth + streetSize
const cycleHeight = blockHeight + streetSize
const blkXs = []
const blkYs = []
for (let x = 0; x < screenWidth; x++) {
  if (x % cycleWidth < blockWidth) {
    blkXs.push(x)
  }
}
for (let y = 0; y < screenHeight; y++) {
  if (y % cycleHeight < blockHeight) {
    blkYs.push(y)
  }
}

const range = streetSize / 2
const vertCarPts = []
const horCarPts = []
for (let pt of ptsOutBlk) {
  let [x, y] = pt
  if (blkYs.includes(y)) {
    vertCarPts.push([x, y])
  } else {
    horCarPts.push([x, y])
  }
}

const cars = []
for (let horCar = 0; horCar < nBlocks; horCar++) {
  for (let i = 0; i < nCars; i++) {
    cars.push(makeCar(getRandElem(horCarPts), carLength, carHeight))
  }
}

for (let vertCar = 0; vertCar < nBlocks; vertCar++) {
  for (let i = 0; i < nCars; i++) {
    cars.push(makeCar(getRandElem(vertCarPts), carHeight, carLength))
  }
}

const Cols = [
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

const border = new bt.Turtle()
border.goTo([0,0])
border.forward(screenWidth)
border.left(90)
border.forward(screenHeight)
border.left(90)
border.forward(screenWidth)
border.left(90)
border.forward(screenHeight)
if (colorBackground) {
  drawLines(border.lines(), { "fill": getRandElem(Cols) })
} else {
  drawLines(border.lines())
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


if (voronoiBackground) {
  let possibleColors = Cols;
  const ptColors = []
  for (let i=0; i<voronoiPoints;i++) {
    const index = bt.randIntInRange(0, possibleColors.length-1);
    ptColors.push(possibleColors[index]);
    possibleColors.splice(index, 1);
  }
  const pts = []
  const lines = []
  for (let i=0; i<voronoiPoints; i++) {
    pts.push([bt.rand() * screenWidth, bt.rand() * screenHeight]);
    lines.push([])
  }

  for (let w=0;w<screenWidth;w++) {
    for (let h=0;h<screenHeight;h++) {
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
    drawLines(tess.lines(), {"fill": ptColors[lines.indexOf(tessel)]})
  }
}

for (const crosswalk of crosswalks) {
  drawLines(crosswalk, {"stroke": "white"});
}

if (colorBuildings) {
  for (const block of blocks) {
    drawLines(block, { "fill": getRandElem(Cols) , "width": sidewalkWidth})
  }
} else {
  for (const block of blocks) {
    if (calcPerim(block) == 240) {
      drawLines(block, {"width": sidewalkWidth})
    } else {
      drawLines(block)
    }
  }
}

if (colorCars) {
  for (const car of cars) {
    drawLines(car, { "fill": getRandElem(Cols) })
  }
  }else {
  for (const car of cars) {
    drawLines(car)
  }
}

for (const lane of lanes) {
  drawLines(lane, {"fill": "white"});
}

for (const poly of polys) {
  drawLines(poly);
}
