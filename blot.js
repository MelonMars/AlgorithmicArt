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
setDocDimensions(screenWidth, screenHeight);

function getRandElem(arr) {
  const randI = Math.floor(Math.random() * arr.length);
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
  let [x, y] = startPos
  return(
    [[startPos, [x, y + carH]],
    [[x, y + carH],[x + carL, y + carH]],
    [[x + carL, y + carH],[x + carL, y]],
    [[x + carL, y], startPos]]);
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

  for (let k = 0; k <= bh; k += bh + streetSize) {
    for (let l = 0; l < crosswalkWidth; l += stripeWidth + gapWidth) {
      cw.up();
      cw.goTo([startPos[0] - l, startPos[1] + k]);
      cw.down();
      cw.left(90);
      cw.forward(crossWalkSize);
      cw.right(90);
    }
  }

  for (let k = 0; k <= bh; k += bh + streetSize) {
    for (let l = 0; l < crosswalkWidth; l += stripeWidth + gapWidth) {
      cw.up();
      cw.goTo([startPos[0] - l, startPos[1] - k]);
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
for (let blkVert = 0; blkVert < nBlocks; blkVert++) {
  for (let blkHor = 0; blkHor < nBlocks; blkHor++) {
    let startPos = [blkHor * (blockWidth + streetSize), blkVert * (blockHeight + streetSize)]
    blocks.push(makeBlock(startPos, blockWidth, blockHeight))
    crosswalks.push(drawCrosswalks(startPos, blockWidth, blockHeight, streetSize));
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
  console.log("x: ", x)
  console.log("y: ", y)
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

const blockCols = ["green", "red", "black", "blue", "orange", "navy", "pink", "purple"]

const border = new bt.Turtle()
border.goTo([0,0])
border.forward(screenWidth)
border.left(90)
border.forward(screenHeight)
border.left(90)
border.forward(screenWidth)
border.left(90)
border.forward(screenHeight)
drawLines(border.lines(), { "fill": getRandElem(blockCols) })

blocks.push(...cars)
for (const block of blocks) {
  drawLines(block, { "fill": getRandElem(blockCols) })
}

for (const crosswalk of crosswalks) {
  drawLines(crosswalk);
}
