/*
Cyberpunk City by github.com/MelonMars
*/

const blockWidth = 50; //Width of a block
const blockHeight = 50; //Height of a block
const nBlocks = 7; // Number of blocks on each row and height
const streetSize = 10; //Thickness of the street
const screenHeight = nBlocks * (blockHeight + streetSize);
const screenWidth = nBlocks * (blockWidth + streetSize);
const carHeight = 1; //Height of each car
const carLength = 10; //Length of each car
const nCars = 5 //Number of cars, similar to number of blocks
const skyScraperChance = 0.3
const skyScraperJumps = 5 // How many tiers you want in your tiered skyscraper
const skyScraperReductionFactor = 0.4;
const colorCars = false
const colorBuildings = false
const colorBackground = false
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
  car.forward(carL)
  car.left(90)
  car.forward(carH)
  car.left(90)
  car.forward(carL)
  car.left(90)
  car.forward(carH)
  return (car.lines())  
}

const blocks = []
for (let blkVert = 0; blkVert < nBlocks; blkVert++) {
  for (let blkHor = 0; blkHor < nBlocks; blkHor++) {
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
    }
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

const Cols = ["green", "red", "black", "blue", "orange", "navy", "pink", "purple"]

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

if (colorBuildings) {
  for (const block of blocks) {
    drawLines(block, { "fill": getRandElem(Cols) })
  }
} else {
  for (const block of blocks) {
    drawLines(block)
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