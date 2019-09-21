document.addEventListener('DOMContentLoaded', () => {
  const width = 18
  const grid = document.querySelector('.grid')

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

  const noPipLocations =
      [19,34,115,116,117,118,144,145,146,147,148,149,150,151,154,155,156,157,
        158,159,160,161,115,116,117,118,169,170,171,172,133,136,289,151,154,304,205]

  const cells = []

 

  let pacIntervalId = 0
  const validKey = [37, 38, 39, 40]

  let leftWall = false
  let upWall = false
  let rightWall = false
  let downWall = false
  let pacPosition = 205
  let ghostPositions = {
    inky: 169,
    pinky: 170,
    blinky: 171,
    clyde: 172
  }
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
      //console.log(wallLocations.includes(index))
      if (!noPipLocations.includes(index) && !wallLocations.includes(index))
        element.classList.add('pip')
    })
  }

  function addGhosts() {
    cells[ghostPositions.inky].classList.add('inky')
    cells[ghostPositions.blinky].classList.add('blinky')
    cells[ghostPositions.pinky].classList.add('pinky')
    cells[ghostPositions.clyde].classList.add('clyde')
  }

  function getWalls() {
    leftWall = (cells[pacPosition - 1].classList.contains('wall'))
    upWall = (cells[pacPosition - width].classList.contains('wall'))
    rightWall = (cells[pacPosition + 1].classList.contains('wall'))
    downWall = (cells[pacPosition + width].classList.contains('wall'))
  }

  function eatPip() {
    if (cells[pacPosition].classList.contains('pip')){
      cells[pacPosition].classList.remove('pip')
      totalScore += 10
      pipsRemaining -= 1
    }
  }

  function winLose() {
    console.log(ghostPositions.values)
    if (pipsRemaining === 0) {
      console.log('you have won')
      clearInterval(pacIntervalId)
    }
    if (Object.values(ghostPositions).includes(pacPosition)) {
      console.log('you have lost')
      clearInterval(pacIntervalId)
    }
  }


  buildGrid()
  addWalls()
  addPips()
  addGhosts()
  //adding the player on to the grid in starting position
  cells[pacPosition].classList.add('player')

  //==================//
  // Pac-Man movements//
  //==================//

  document.addEventListener('keyup', (e) => {
    if (validKey.includes(e.keyCode)) {
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
          console.log(totalScore)
          eatPip()
          winLose()
          cells[pacPosition].classList.add('player')
        }, 100)
      }
    }
  })













})


