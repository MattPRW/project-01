![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Software Engineneering Immersive: Project 1
The first project for the General Assembly Software Engineering Immersive course, created as a solo project in 7 days over week 4 of the course.

---

# Pac-Man Clone

Using vanilla Javascript, HTML and CSS, I create a clone of the classic arcade game Pac-Man.

## Built With	

		* HTML5
		* CSS3
		* Vanilla Javascript

## Deployment

The game is deployed on GitHub Pages and it can be found here:

 https://mattprw.github.io/project-01/

## Getting Started

Use the clone button to download the game source code. Open the index.html file in your browser and the game should start, if not check console for any issues. All assets used in the game are saved in the assets folder, all images used are gif or png nd all sounds are wav

## Game Architecture

The game is based on a 18x18 grid, with each cell being either a space or a wall. The spaces can contain either a pip or a power pill which can be collected by the player when entering the cell. The player controls Pac-Man with the four arrow keys, navigating him around a maze. The aim is to eat all of the pips whilst avoiding the 4 randomly moving ghosts. 

![image-20191202145327308](/screenshots/gameplay-screenshot.png)

There are 4 ghosts that start from the centre of the screen, which move randomly around the board, if the player enters a square in which there is a ghost 1 life is lost and the player returns to the starting position. If this happens 3 times the game is over.

If a player collects a power pill the ghosts change colour, the movement speed is increased and the player will be able to 'eat' the ghosts. This lasts for 30 seconds.

The player can only move around the cells that do not contain a wall, here is the code that controls the movement of the player-

```js
``//==================//
  // Pac-Man movements//
  //==================//

  document.addEventListener('keyup', (e) => {
    if (validKey.includes(e.keyCode) && (!gameOver)) {
      getWalls()
      if ((e.keyCode === 37 && !leftWall) || (e.keyCode === 38 && !upWall) || (e.keyCode === 39 && !rightWall) || (e.keyCode === 40 && !downWall)) {
        clearInterval(pacIntervalId)
        pacIntervalId = setInterval(() => {
          cells[pacPosition].classList.remove('left', 'up', 'right', 'down', 'player')
          getWalls()
          //Set pac-Man moving
          switch (e.keyCode) {
            case 37:
              if (pacPosition === 144) pacPosition = 161
              if (!leftWall) pacPosition -= 1
              cells[pacPosition].classList.add('player', 'left')
              break
            case 38:
              if (!upWall) pacPosition -= width
              cells[pacPosition].classList.add('player', 'up')
              break
            case 39:
              if (pacPosition === 161) pacPosition = 144
              if (!rightWall) pacPosition += 1
              cells[pacPosition].classList.add('player', 'right')
              break
            case 40:
              if (!downWall) pacPosition += width
              cells[pacPosition].classList.add('player', 'down')
              break
          }
          eatPip()
          if (!powerMode) {
            eatPowerPill()
          }

          winLose()
          // addPLayer()
          document.querySelector('.score-counter').innerHTML = `Score: ${totalScore}`
        }, 100)
      }
```

As the board fills up, there are also some rules that set an hierarchy to tell Squidward where to go if the column it's meant to go to is already full. It looks at the closest columns available then moves on to ones further away. If there are no more available places then **it's a draw**.

After every move of both players (or both the player and the computer), the game checks for 'winning' of each player (in one player mode if squidward wins that means that player lost). Winning assigns and point to Spongebob and loosing assigns one to Squidward. The functions also highlight the cells that won/lost respectively yellow or red and the top row is hidden so the player can't continue to play on.

## Ghost Movement

Each of the four ghosts has the same movement logic, and moves in a random pattern. Unlike the player character, the ghost will not remove pips or power pills when entering a square that contains one. The ghosts movement code looks lie this

``` javascript
function inkyMovement() {
    inkyIntervalId = setInterval(() => {
      getInky()
      getInkyPositions()
      cells[ghostPositions.inky].classList.remove(ghostState, 'inky')
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
      cells[ghostPositions.inky].classList.add('inky', ghostState)
    }, inkyInterval)
  }

```


## Challenges and future improvements

The main challenge for the project was creating the ghost behaviour. A lot ofthought had to go in to making the ghosts move randomly and behave as the should. In the original game each ghost had a distinct movement oattern and 3 different modes of movement each. Given the time I would have liked to have been able to implement the specific behaviour for each of the ghosts

## Author

Matt Wilkie- First Project
Link to portfolio here: matthewwilkie.com