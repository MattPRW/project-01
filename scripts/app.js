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
  const cells = []
  let pacPosition = 289

  //creating the empty grid divs
  for (let i = 0; i < width ** 2; i++) {
    const cell = document.createElement('DIV')
    grid.appendChild(cell)
    cells.push(cell)
  }

  //adding the wall class to the tile divs
  cells.forEach((element, index) => {
    if (wallLocations.includes(index))
      element.classList.add('wall')
  })

  //adding the player on to the grid in starting position
  cells[pacPosition].classList.add('player')


  let pacIntervalId = 0
  let movement = false
  const validKey = [37, 38, 39, 40]

  //==================//
  // Pac-Man movements//
  //==================//

  document.addEventListener('keyup', (e) => {
    if (validKey.includes(e.keyCode)) {
      clearInterval(pacIntervalId)
      pacIntervalId = setInterval(() => {
        cells[pacPosition].classList.remove('player')
        const leftWall = (cells[pacPosition - 1].classList.contains('wall') === false)
        const upWall = (cells[pacPosition - width].classList.contains('wall') === false)
        const rightWall =  (cells[pacPosition + 1].classList.contains('wall') === false)
        const downWall = (cells[pacPosition + width].classList.contains('wall') === false)

        //Set pac-Man moving
        switch (e.keyCode) {
          case 37:
            if (leftWall) {
              pacPosition -= 1  
              movement = true
            }
            break
          case 38:
            if (upWall) {
              pacPosition -= width
              movement = true
            }
            break
          case 39:
            if (rightWall) {
              pacPosition += 1
              movement = true
            }
            break
          case 40:
            if (downWall) {
              pacPosition += width
              movement = true
            }
            break
        }
        cells[pacPosition].classList.add('player')

        //Stop pac-man at walls
        switch (e.keyCode) {
          case 37: if (!leftWall) clearInterval(pacIntervalId)
            break
          case 38: if (!upWall) clearInterval(pacIntervalId)
            break
          case 39: if (!rightWall) clearInterval(pacIntervalId)
            break
          case 40: if (!downWall) clearInterval(pacIntervalId)
            break
        }
      }, 150)
    }
  })













})


