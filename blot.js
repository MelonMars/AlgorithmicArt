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
  console.log("Lines: " + blk.lines())
  return (blk.lines())
}

function makeCar(startPos, carL, carH) {
  const car = new bt.Turtle()
  car.up()
  car.goTo(startPos)
  car.down()
  for (let i = 0; i < carH; i++) {
    car.forward(carL)
    car.left(90)
    car.forward(jmpHeight)
    car.left(90)
    car.forward(carL)
    car.right(180)
  }
  drawLines(car.lines())
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



const ptsOutBlk = []
const ptsInBlk = []
for (let x = 0; x < screenWidth; x++) {
  for (let y = 0; y < screenHeight; y++) {
    if (insideBlock(x, y)) {
      ptsInBlk.push([
        [x, y]
      ])
    } else {
      ptsOutBlk.push([
        [x, y]
      ])
    }
  }
}

const range = streetSize / 2
const vertCarPts = []
const horCarPts = []
let blkXs = ptsInBlk.map(pair => pair[0]);
console.log("Points out Block: ", ptsOutBlk);
console.log("Points in Block: ", ptsInBlk);
console.log("Block Xs: ", blkXs)
for (let pt of ptsOutBlk) {
  let [x, y] = pt
  if (x in blkXs) {
    horCarPts.push([x,y])
  } else {
    vertCarPts.push([x,y])
  }
}

console.log("Vertical Points: " + vertCarPts)
console.log("Horizontal Points: " + horCarPts)
