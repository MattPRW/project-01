document.addEventListener('DOMContentLoaded', () => {
  const width = 18
  const grid = document.querySelector('.grid')
  const cells = []
  //keyCodes for left, up, right, down
  const validKey = [37, 38, 39, 40]

  let gameStarted = false

  //========================
  //== Creating the board ==
  //========================

  //This array holds the locations of all of the wall tiles. These are used to create classes on the relevant divs
  const wallLocations =
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 35, 36,
      38, 39, 40, 41, 42, 44, 45, 47, 48, 49, 50, 51, 53, 54, 56, 57, 58, 59,
      60, 62, 63, 65, 66, 67, 68, 69, 71, 72, 89, 90, 92, 93, 94, 95, 96, 97,
      98, 99, 100, 101, 102, 103, 104, 105, 107, 108, 114, 119, 125, 126,
      127, 128, 129, 130, 132, 134, 135, 137, 139, 140, 141, 142, 143, 152,
      153, 162, 163, 164, 165, 166, 168, 173, 175, 176, 177, 178, 179, 180,
      181, 182, 183, 184, 186, 187, 188, 189, 190, 191, 193, 194, 195, 196,
      197, 198, 206, 207, 215, 216, 218, 219, 220, 222, 224, 225, 227, 229,
      230, 231, 233, 234, 236, 237, 238, 240, 245, 247, 248, 249, 251, 252,
      258, 259, 260, 261, 262, 263, 269, 270, 272, 273, 274, 275, 276, 277,
      278, 279, 280, 281, 282, 283, 284, 285, 287, 288, 305, 306, 307, 308,
      309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323]

  //This array holds the non-wall locations that shouldn't have pips
  const noPipLocations =
    [19, 34, 115, 116, 117, 118, 144, 145, 146, 147, 148, 149, 150, 151, 154, 155, 156, 157,
      158, 159, 160, 161, 115, 116, 117, 118, 169, 170, 171, 172, 133, 136, 289, 151, 154, 304, 205]

  let pacIntervalId 
  let inkyIntervalId 
  let pinkyIntervalId 
  let blinkyIntervalId 
  let clydeIntervalId 
  // let pacIntervalId = 0
  // let pacIntervalId = 0

  let leftWall = false
  let upWall = false
  let rightWall = false
  let downWall = false
  let pacPosition = 205
  // let inkyPosition = 169


  // const ghostTargets = {
  //   inky: 1,
  //   pinky: 16,
  //   blinky: 307,
  //   clyde: 322
  // }

  const ghostPositions = {
    inky: 169,
    inkyDir: 'up',
    inkyJunction: false,
    pinky: 170,
    pinkyDir: 'left',
    pinkyJunction: false,
    blinky: 171,
    blinkyDir: 'right',
    blinkyJunction: false,
    clyde: 172,
    clydeDir: 'up',
    clydeJunction: false
  }
  const inkyWalls = {
    left: false,
    up: false,
    right: false,
    down: false
  }

  const pinkyWalls = {
    left: false,
    up: false,
    right: false,
    down: false
  }

  const blinkyWalls = {
    left: false,
    up: false,
    right: false,
    down: false
  }

  const clydeWalls = {
    left: false,
    up: false,
    right: false,
    down: false
  }

  // const inkyGhosts = {
  //   left: false,
  //   up: false,
  //   right: false,
  //   down: false
  // }

  let totalScore = 0
  let pipsRemaining = 109

  //Building the grid
  function buildGrid() {
    for (let i = 0; i < width ** 2; i++) {
      const cell = document.createElement('DIV')
      grid.appendChild(cell)
      cells.push(cell)
    }
  }

  //adding the wall class to the tile divs
  function addWalls() {
    cells.forEach((element, index) => {
      if (wallLocations.includes(index))
        element.classList.add('wall')
    })
  }

  function addPips() {
    cells.forEach((element, index) => {
      if (!noPipLocations.includes(index) && !wallLocations.includes(index))
        element.classList.add('pip')
    })
  }

  function addPLayer() {
    cells[pacPosition].classList.add('player')
  }

  function addGhosts() {
    cells[ghostPositions.inky].classList.add('ghost', 'inky')
    cells[ghostPositions.blinky].classList.add('ghost', 'blinky')
    cells[ghostPositions.pinky].classList.add('ghost', 'pinky')
    cells[ghostPositions.clyde].classList.add('ghost', 'clyde')
  }


  function getWalls() {
    leftWall = (cells[pacPosition - 1].classList.contains('wall'))
    upWall = (cells[pacPosition - width].classList.contains('wall'))
    rightWall = (cells[pacPosition + 1].classList.contains('wall'))
    downWall = (cells[pacPosition + width].classList.contains('wall'))
  }

  function getInky() {
    inkyWalls.left = (cells[ghostPositions.inky - 1].classList.contains('wall'))
    inkyWalls.up = (cells[ghostPositions.inky - width].classList.contains('wall'))
    inkyWalls.right = (cells[ghostPositions.inky + 1].classList.contains('wall'))
    inkyWalls.down = (cells[ghostPositions.inky + width].classList.contains('wall'))
  }

  function getPinky() {
    pinkyWalls.left = (cells[ghostPositions.pinky - 1].classList.contains('wall'))
    pinkyWalls.up = (cells[ghostPositions.pinky - width].classList.contains('wall'))
    pinkyWalls.right = (cells[ghostPositions.pinky + 1].classList.contains('wall'))
    pinkyWalls.down = (cells[ghostPositions.pinky + width].classList.contains('wall'))
  }

  function getBlinky() {
    blinkyWalls.left = (cells[ghostPositions.blinky - 1].classList.contains('wall'))
    blinkyWalls.up = (cells[ghostPositions.blinky - width].classList.contains('wall'))
    blinkyWalls.right = (cells[ghostPositions.blinky + 1].classList.contains('wall'))
    blinkyWalls.down = (cells[ghostPositions.blinky + width].classList.contains('wall'))
  }

  function getClyde() {
    clydeWalls.left = (cells[ghostPositions.clyde - 1].classList.contains('wall'))
    clydeWalls.up = (cells[ghostPositions.clyde - width].classList.contains('wall'))
    clydeWalls.right = (cells[ghostPositions.clyde + 1].classList.contains('wall'))
    clydeWalls.down = (cells[ghostPositions.clyde + width].classList.contains('wall'))
  }


  function getInkyPositions() {
    let x = 0
    if (!inkyWalls.left) x++
    if (!inkyWalls.up) x++
    if (!inkyWalls.right) x++
    if (!inkyWalls.down) x++
    if (x === 3) ghostPositions.inkyJunction = 3
    else if (x === 4) ghostPositions.inkyJunction = 4
    else ghostPositions.inkyJunction = 0
  }

  function getPinkyPositions() {
    let x = 0
    if (!pinkyWalls.left) x++
    if (!pinkyWalls.up) x++
    if (!pinkyWalls.right) x++
    if (!pinkyWalls.down) x++
    if (x === 3) ghostPositions.pinkyJunction = 3
    else if (x === 4) ghostPositions.pinkyJunction = 4
    else ghostPositions.pinkyJunction = 0
  }

  function getBlinkyPositions() {
    let x = 0
    if (!blinkyWalls.left) x++
    if (!blinkyWalls.up) x++
    if (!blinkyWalls.right) x++
    if (!blinkyWalls.down) x++
    if (x === 3) ghostPositions.blinkyJunction = 3
    else if (x === 4) ghostPositions.blinkyJunction = 4
    else ghostPositions.blinkyJunction = 0
  }

  function getClydePositions() {
    let x = 0
    if (!clydeWalls.left) x++
    if (!clydeWalls.up) x++
    if (!clydeWalls.right) x++
    if (!clydeWalls.down) x++
    if (x === 3) ghostPositions.clydeJunction = 3
    else if (x === 4) ghostPositions.clydeJunction = 4
    else ghostPositions.clydeJunction = 0
  }





  function eatPip() {
    if (cells[pacPosition].classList.contains('pip')) {
      cells[pacPosition].classList.remove('pip')
      totalScore += 10
      pipsRemaining -= 1
    }
  }

  function winLose() {
    if (pipsRemaining === 0) {
      console.log('you have won')
      clearInterval(pacIntervalId)
      clearInterval(inkyIntervalId)
      clearInterval(pinkyIntervalId)
      clearInterval(blinkyIntervalId)
      clearInterval(clydeIntervalId)
    }
    if (Object.values(ghostPositions).includes(pacPosition)) {
      console.log('you have lost')
      clearInterval(pacIntervalId)
      clearInterval(inkyIntervalId)
      clearInterval(pinkyIntervalId)
      clearInterval(blinkyIntervalId)
      clearInterval(clydeIntervalId)
    }
  }

  buildGrid()
  addWalls()
  addPips()
  addGhosts()
  addPLayer()

  //==================//
  // Ghost movements  //
  //==================//

  function checkInkyJunction() {
    if (ghostPositions.inkyJunction === 3 && Math.floor(Math.random() * 2) === 0) return '3a'
    if (ghostPositions.inkyJunction === 3 && Math.floor(Math.random() * 2) === 1) return '3b'
    if (ghostPositions.inkyJunction === 4 && Math.floor(Math.random() * 3) === 0) return '4a'
    if (ghostPositions.inkyJunction === 4 && Math.floor(Math.random() * 3) === 1) return '4b'
    if (ghostPositions.inkyJunction === 4 && Math.floor(Math.random() * 3) === 2) return '4c'
  }

  function checkPinkyJunction() {
    if (ghostPositions.pinkyJunction === 3 && Math.floor(Math.random() * 2) === 0) return '3a'
    if (ghostPositions.pinkyJunction === 3 && Math.floor(Math.random() * 2) === 1) return '3b'
    if (ghostPositions.pinkyJunction === 4 && Math.floor(Math.random() * 3) === 0) return '4a'
    if (ghostPositions.pinkyJunction === 4 && Math.floor(Math.random() * 3) === 2) return '4b'
    if (ghostPositions.pinkyJunction === 4 && Math.floor(Math.random() * 3) === 3) return '4c'
  }

  function checkBlinkyJunction() {
    if (ghostPositions.blinkyJunction === 3 && Math.floor(Math.random() * 2) === 0) return '3a'
    if (ghostPositions.blinkyJunction === 3 && Math.floor(Math.random() * 2) === 1) return '3b'
    if (ghostPositions.blinkyJunction === 4 && Math.floor(Math.random() * 3) === 0) return '4a'
    if (ghostPositions.blinkyJunction === 4 && Math.floor(Math.random() * 3) === 2) return '4b'
    if (ghostPositions.blinkyJunction === 4 && Math.floor(Math.random() * 3) === 3) return '4c'
  }

  function checkClydeJunction() {
    if (ghostPositions.clydeJunction === 3 && Math.floor(Math.random() * 2) === 0) return '3a'
    if (ghostPositions.clydeJunction === 3 && Math.floor(Math.random() * 2) === 1) return '3b'
    if (ghostPositions.clydeJunction === 4 && Math.floor(Math.random() * 3) === 0) return '4a'
    if (ghostPositions.clydeJunction === 4 && Math.floor(Math.random() * 3) === 2) return '4b'
    if (ghostPositions.clydeJunction === 4 && Math.floor(Math.random() * 3) === 3) return '4c'
  }

  function inkyMovement() {
    inkyIntervalId = setInterval(() => {
      getInky()
      getInkyPositions()
      cells[ghostPositions.inky].classList.remove('ghost', 'inky')
      switch (ghostPositions.inkyDir) {
        case 'left':
          if (ghostPositions.inky === 144) ghostPositions.inky = 161
          else if (checkInkyJunction() === '3a' || checkInkyJunction() === '4a') ghostPositions.inkyDir = 'up'
          else if (checkInkyJunction() === '3b' || checkInkyJunction() === '4b') ghostPositions.inkyDir = 'down'
          else if (checkInkyJunction() === '4c') ghostPositions.inkyDir = 'right'
          else if (!inkyWalls.left) ghostPositions.inky -= 1
          else if (!inkyWalls.up) ghostPositions.inkyDir = 'up'
          else if (!inkyWalls.down) ghostPositions.inkyDir = 'down'
          break
        case 'up':
          if (checkInkyJunction() === '3a' || checkInkyJunction() === '4a') ghostPositions.inkyDir = 'left'
          else if (checkInkyJunction() === '3b' || checkInkyJunction() === '4b') ghostPositions.inkyDir = 'right'
          else if (checkInkyJunction() === '4c') ghostPositions.inkyDir = 'down'
          else if (!inkyWalls.up) ghostPositions.inky -= width
          else if (!inkyWalls.right) ghostPositions.inkyDir = 'right'
          else if (!inkyWalls.left) ghostPositions.inkyDir = 'left'
          break
        case 'right':
          if (ghostPositions.inky === 161) ghostPositions.inky = 144
          else if (checkInkyJunction() === '3a' || checkInkyJunction() === '4a') ghostPositions.inkyDir = 'down'
          else if (checkInkyJunction() === '3b' || checkInkyJunction() === '4b') ghostPositions.inkyDir = 'up'
          else if (checkInkyJunction() === '4c') ghostPositions.inkyDir = 'up'
          else if (!inkyWalls.right) ghostPositions.inky += 1
          else if (!inkyWalls.down) ghostPositions.inkyDir = 'down'
          else if (!inkyWalls.up) ghostPositions.inkyDir = 'up'
          break
        case 'down':
          if (checkInkyJunction() === '3a' || checkInkyJunction() === '4a') ghostPositions.inkyDir = 'right'
          else if (checkInkyJunction() === '3b' || checkInkyJunction() === '4b') ghostPositions.inkyDir = 'left'
          else if (checkInkyJunction() === '4c') ghostPositions.inkyDir = 'left'
          else if (!inkyWalls.down) ghostPositions.inky += width
          else if (!inkyWalls.left) ghostPositions.inkyDir = 'left'
          else if (!inkyWalls.right) ghostPositions.inkyDir = 'right'
          break
      }
      cells[ghostPositions.inky].classList.add('ghost', 'inky')
    }, 200)
  }

  function pinkyMovement() {
    pinkyIntervalId = setInterval(() => {
      getPinky()
      getPinkyPositions()
      cells[ghostPositions.pinky].classList.remove('ghost', 'pinky')
      switch (ghostPositions.pinkyDir) {
        case 'left':
          if (ghostPositions.pinky === 144) ghostPositions.pinky = 161
          else if (checkPinkyJunction() === '3a' || checkPinkyJunction() === '4a') ghostPositions.pinkyDir = 'up'
          else if (checkPinkyJunction() === '3b' || checkPinkyJunction() === '4b') ghostPositions.pinkyDir = 'down'
          else if (checkPinkyJunction() === '4c') ghostPositions.pinkyDir = 'right'
          else if (!pinkyWalls.left) ghostPositions.pinky -= 1
          else if (!pinkyWalls.up) ghostPositions.pinkyDir = 'up'
          else if (!pinkyWalls.down) ghostPositions.pinkyDir = 'down'
          break
        case 'up':
          if (checkPinkyJunction() === '3a' || checkPinkyJunction() === '4a') ghostPositions.pinkyDir = 'left'
          else if (checkPinkyJunction() === '3b' || checkPinkyJunction() === '4b') ghostPositions.pinkyDir = 'right'
          else if (checkPinkyJunction() === '4c') ghostPositions.pinkyDir = 'down'
          else if (!pinkyWalls.up) ghostPositions.pinky -= width
          else if (!pinkyWalls.right) ghostPositions.pinkyDir = 'right'
          else if (!pinkyWalls.left) ghostPositions.pinkyDir = 'left'
          break
        case 'right':
          if (ghostPositions.pinky === 161) ghostPositions.pinky = 144
          else if (checkPinkyJunction() === '3a' || checkPinkyJunction() === '4a') ghostPositions.pinkyDir = 'down'
          else if (checkPinkyJunction() === '3b' || checkPinkyJunction() === '4b') ghostPositions.pinkyDir = 'up'
          else if (checkPinkyJunction() === '4c') ghostPositions.pinkyDir = 'up'
          else if (!pinkyWalls.right) ghostPositions.pinky += 1
          else if (!pinkyWalls.down) ghostPositions.pinkyDir = 'down'
          else if (!pinkyWalls.up) ghostPositions.pinkyDir = 'up'
          break
        case 'down':
          if (checkPinkyJunction() === '3a' || checkPinkyJunction() === '4a') ghostPositions.pinkyDir = 'right'
          else if (checkPinkyJunction() === '3b' || checkPinkyJunction() === '4b') ghostPositions.pinkyDir = 'left'
          else if (checkPinkyJunction() === '4c') ghostPositions.pinkyDir = 'left'
          else if (!pinkyWalls.down) ghostPositions.pinky += width
          else if (!pinkyWalls.left) ghostPositions.pinkyDir = 'left'
          else if (!pinkyWalls.right) ghostPositions.pinkyDir = 'right'
          break
      }
      cells[ghostPositions.pinky].classList.add('ghost', 'pinky')
    }, 200)
  }

  function blinkyMovement() {
    blinkyIntervalId = setInterval(() => {
      getBlinky()
      getBlinkyPositions()
      cells[ghostPositions.blinky].classList.remove('ghost', 'blinky')
      switch (ghostPositions.blinkyDir) {
        case 'left':
          if (ghostPositions.blinky === 144) ghostPositions.blinky = 161
          else if (checkBlinkyJunction() === '3a' || checkBlinkyJunction() === '4a') ghostPositions.blinkyDir = 'up'
          else if (checkBlinkyJunction() === '3b' || checkBlinkyJunction() === '4b') ghostPositions.blinkyDir = 'down'
          else if (checkBlinkyJunction() === '4c') ghostPositions.blinkyDir = 'right'
          else if (!blinkyWalls.left) ghostPositions.blinky -= 1
          else if (!blinkyWalls.up) ghostPositions.blinkyDir = 'up'
          else if (!blinkyWalls.down) ghostPositions.blinkyDir = 'down'
          break
        case 'up':
          if (checkBlinkyJunction() === '3a' || checkPinkyJunction() === '4a') ghostPositions.blinkyDir = 'left'
          else if (checkBlinkyJunction() === '3b' || checkPinkyJunction() === '4b') ghostPositions.blinkyDir = 'right'
          else if (checkBlinkyJunction() === '4c') ghostPositions.blinkyDir = 'down'
          else if (!blinkyWalls.up) ghostPositions.blinky -= width
          else if (!blinkyWalls.right) ghostPositions.blinkyDir = 'right'
          else if (!blinkyWalls.left) ghostPositions.blinkyDir = 'left'
          break
        case 'right':
          if (ghostPositions.blinky === 161) ghostPositions.blinky = 144
          else if (checkBlinkyJunction() === '3a' || checkPinkyJunction() === '4a') ghostPositions.blinkyDir = 'down'
          else if (checkBlinkyJunction() === '3b' || checkPinkyJunction() === '4b') ghostPositions.blinkyDir = 'up'
          else if (checkBlinkyJunction() === '4c') ghostPositions.blinkyDir = 'up'
          else if (!blinkyWalls.right) ghostPositions.blinky += 1
          else if (!blinkyWalls.down) ghostPositions.blinkyDir = 'down'
          else if (!blinkyWalls.up) ghostPositions.blinkyDir = 'up'
          break
        case 'down':
          if (checkPinkyJunction() === '3a' || checkPinkyJunction() === '4a') ghostPositions.blinkyDir = 'right'
          else if (checkBlinkyJunction() === '3b' || checkPinkyJunction() === '4b') ghostPositions.blinkyDir = 'left'
          else if (checkBlinkyJunction() === '4c') ghostPositions.blinkyDir = 'left'
          else if (!blinkyWalls.down) ghostPositions.blinky += width
          else if (!blinkyWalls.left) ghostPositions.blinkyDir = 'left'
          else if (!blinkyWalls.right) ghostPositions.blinkyDir = 'right'
          break
      }
      cells[ghostPositions.blinky].classList.add('ghost', 'blinky')
    }, 200)
  }

  function clydeMovement() {
    clydeIntervalId = setInterval(() => {
      getClyde()
      getClydePositions()
      cells[ghostPositions.clyde].classList.remove('ghost', 'clyde')
      switch (ghostPositions.clydeDir) {
        case 'left':
          if (ghostPositions.clyde === 144) ghostPositions.clyde = 161
          else if (checkClydeJunction() === '3a' || checkClydeJunction() === '4a') ghostPositions.clydeDir = 'up'
          else if (checkClydeJunction() === '3b' || checkClydeJunction() === '4b') ghostPositions.clydeDir = 'down'
          else if (checkClydeJunction() === '4c') ghostPositions.clydeDir = 'right'
          else if (!clydeWalls.left) ghostPositions.clyde -= 1
          else if (!clydeWalls.up) ghostPositions.clydeDir = 'up'
          else if (!clydeWalls.down) ghostPositions.clydeDir = 'down'
          break
        case 'up':
          if (checkClydeJunction() === '3a' || checkClydeJunction() === '4a') ghostPositions.clydeDir = 'left'
          else if (checkClydeJunction() === '3b' || checkClydeJunction() === '4b') ghostPositions.clydeDir = 'right'
          else if (checkClydeJunction() === '4c') ghostPositions.clydeDir = 'down'
          else if (!clydeWalls.up) ghostPositions.clyde -= width
          else if (!clydeWalls.right) ghostPositions.clydeDir = 'right'
          else if (!clydeWalls.left) ghostPositions.clydeDir = 'left'
          break
        case 'right':
          if (ghostPositions.clyde === 161) ghostPositions.clyde = 144
          else if (checkClydeJunction() === '3a' || checkClydeJunction() === '4a') ghostPositions.clydeDir = 'down'
          else if (checkClydeJunction() === '3b' || checkClydeJunction() === '4b') ghostPositions.clydeDir = 'up'
          else if (checkClydeJunction() === '4c') ghostPositions.clydeDir = 'up'
          else if (!clydeWalls.right) ghostPositions.clyde += 1
          else if (!clydeWalls.down) ghostPositions.clydeDir = 'down'
          else if (!clydeWalls.up) ghostPositions.clydeDir = 'up'
          break
        case 'down':
          if (checkClydeJunction() === '3a' || checkClydeJunction() === '4a') ghostPositions.clydeDir = 'right'
          else if (checkClydeJunction() === '3b' || checkClydeJunction() === '4b') ghostPositions.clydeDir = 'left'
          else if (checkClydeJunction() === '4c') ghostPositions.clydeDir = 'left'
          else if (!clydeWalls.down) ghostPositions.clyde += width
          else if (!clydeWalls.left) ghostPositions.clydeDir = 'left'
          else if (!clydeWalls.right) ghostPositions.clydeDir = 'right'
          break
      }
      cells[ghostPositions.clyde].classList.add('ghost', 'clyde')
    }, 200)
  }

  //==================//
  // Pac-Man movements//
  //==================//

  document.addEventListener('keydown', (e) => {
    if (validKey.includes(e.keyCode)) {
      if (!gameStarted) {
        inkyMovement() 
        pinkyMovement()
        blinkyMovement()
        clydeMovement()
        gameStarted = true
      }
      getWalls()
      if ((e.keyCode === 37 && !leftWall) || (e.keyCode === 38 && !upWall) || (e.keyCode === 39 && !rightWall) || (e.keyCode === 40 && !downWall)) {
        clearInterval(pacIntervalId)
        pacIntervalId = setInterval(() => {
          cells[pacPosition].classList.remove('player')
          getWalls()
          //Set pac-Man moving
          switch (e.keyCode) {
            case 37:
              if (pacPosition === 144) pacPosition = 161
              if (!leftWall) pacPosition -= 1
              break
            case 38:
              if (!upWall) pacPosition -= width
              break
            case 39:
              if (pacPosition === 161) pacPosition = 144
              if (!rightWall) pacPosition += 1
              break
            case 40:
              if (!downWall) pacPosition += width
              break
          }
          eatPip()
          winLose()
          addPLayer()
        }, 100)
      }
    }
  })

})


