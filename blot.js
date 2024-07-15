const blockWidth = 50; //Width of a block
const blockHeight = 50; //Height of a block
const nBlocks = 5; // Number of blocks on each row and height
const streetSize = 20; //Thickness of the street
const screenHeight = nBlocks * (blockHeight + streetSize);
const screenWidth = nBlocks * (blockWidth + streetSize);
const carHeight = 5; //Height of each car
const carLength = 5; //Length of each car
const nCars = 5 //Number of cars, similar to number of blocks
const jmpHeight = 0.3; // How far the turtle goes up for each U-turn in the car
setDocDimensions(screenWidth, screenHeight);

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
  drawLines(
    [[startPos, [x, y + carH]],
    [[x, y + carH],[x + carL, y + carH]
    ],
    [
      [x + carL, y + carH],
      [x + carL, y],
      [
        [x + carL, y], startPos
      ]
    ]]);
  return 0;
}

const blocks = []
for (let blkVert = 0; blkVert < nBlocks; blkVert++) {
  for (let blkHor = 0; blkHor < nBlocks; blkHor++) {
    blocks.push(makeBlock([blkHor * (blockWidth + streetSize), blkVert * (blockHeight + streetSize)], blockWidth, blockHeight))
  }
}
for (const block of blocks) {
  drawLines(block, { "fill": "green" })
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

function getRandElem(arr) {
  const randI = Math.floor(Math.random() * arr.length);
  return arr[randI].slice();
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
const glitchPts = [] // THESE SHOULDN'T EXIST
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

for (let horCar = 0; horCar < nBlocks; horCar++) {
  for (let i = 0; i < nCars; i++) {
    makeCar(getRandElem(horCarPts), carLength, carHeight)
  }
}

for (let vertCar = 0; vertCar < nBlocks; vertCar++) {
  for (let i = 0; i < nCars; i++) {
    makeCar(getRandElem(vertCarPts), carHeight, carLength)
  }
}