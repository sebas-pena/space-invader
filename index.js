const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const canvasHeight = 500
const canvasWidth = 500

const clearScreen = () => {
  ctx.fillStyle = "#000"
  ctx.rect(0, 0, canvasWidth, canvasHeight)
  ctx.fill()
  ctx.strokeStyle = "#20FF20"
  ctx.lineWidth = 5
  ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
}

const printHud = (score, hiScore, lives) => {
  ctx.fillStyle = "#fff"
  ctx.font = "400 20px Arcade"
  ctx.textAlign = "start"
  ctx.fillText("SCORE", 30, 30)
  ctx.textAlign = "center"
  ctx.fillText("HI-SCORE", canvasWidth / 2, 30)
  ctx.fillText(hiScore, canvasWidth / 2, 50)
  ctx.textAlign = "start"
  ctx.font = "500 18px Arcade"
  ctx.fillText(score, 30, 50)
  ctx.fillText(lives, 30, canvasHeight - 15)
  ctx.textAlign = "end"
  ctx.fillText("CREDIT 00", canvasWidth - 30, canvasHeight - 15)
  ctx.moveTo(30, canvasHeight - 40)
  ctx.strokeStyle = "#20FF20"
  ctx.lineWidth = 2
  ctx.lineTo(canvasWidth - 30, canvasHeight - 40)
  ctx.stroke()
}

const startGame = () => {
  ctx.drawImage(playerSprite, 100, 100)
  ctx.drawImage(enemySprite, 150, 150)
  ctx.drawImage(enemy2Sprite, 200, 200)
  ctx.drawImage(enemy3Sprite, 250, 250)
  ctx.drawImage(enemyShipSprite, 300, 300)
}
class Player {
  constructor() {
    this.positionX = canvasWidth / 2 - 8
    this.velocity = 0
    const sprite = new Image()
    sprite.src = "./assets/sprites/player.png"
    sprite.onload = () => {
      this.sprite = sprite
      this.draw()
    }
  }

  setPosition() {
    const newPosition = this.positionX + this.velocity * 5

    if (newPosition > 30 && newPosition < canvasWidth - 60) {
      this.positionX = newPosition
    }
  }

  draw() {
    if (this.sprite) {
      ctx.fillStyle = "#000"
      ctx.fillRect(this.positionX, canvasHeight - 60, 30, 16)
      this.setPosition()
      ctx.drawImage(this.sprite, this.positionX, canvasHeight - 60)
    }
  }
}

clearScreen()
printHud()

const player = new Player()
const ismoving = false

window.addEventListener("keydown", ({ key }) => {
  console.log("algo")
  console.log("algo2")
  if (key == "ArrowLeft" || key == "a") {
    player.velocity = -1
  } else if (key == "ArrowRight" || key == "d") {
    player.velocity = 1
  } else if ((key = " ")) {
  }
})

window.addEventListener("keyup", () => {
  player.velocity = 0
})

setInterval(() => {
  player.draw()
}, 33)
