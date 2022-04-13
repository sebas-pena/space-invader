const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const canvasHeight = 500
const canvasWidth = 500

let playerProjectiles = []
let enemyProjectiles = []

const clearScreen = () => {
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
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
  ctx.drawImage(ufoSprite, 300, 300)
}

class Player {
  constructor() {
    this.positionX = canvasWidth / 2 - 8
    this.velocity = 0
    this.shootCooldown = false
    this.lives = 3
    const sprite = new Image()
    sprite.src = "./assets/sprites/player.png"
    sprite.onload = () => {
      this.sprite = sprite
      this.draw()
    }
  }
  deathSound = new Audio("./assets/sounds/explosion.wav")
  shotSound = new Audio("./assets/sounds/shoot.wav")
  spriteWidth = 30
  spriteHeight = 16
  positionY = canvasHeight - 60
  shot() {
    if (!this.shootCooldown) {
      const Xaxis = this.positionX + 13
      const Yaxis = 425
      const projectile = new Projectile(2, Xaxis, Yaxis, -2)
      this.shotSound.play()
      playerProjectiles.push(projectile)
      this.shootCooldown = true
      setTimeout(() => {
        this.shootCooldown = false
      }, 200)
    }
  }
  clear() {
    ctx.fillStyle = "#000"
    ctx.fillRect(this.positionX - 1, canvasHeight - 60, 32, 16)
  }

  explode() {
    this.clear()
    this.deathSound.play()
    this.lives--
    this.positionX = canvasWidth / 2 - 8
    console.log(this.lives)
  }
  setPosition() {
    const newPosition = this.positionX + this.velocity * 5

    if (newPosition > 30 && newPosition < canvasWidth - 60) {
      this.positionX = newPosition
    }
  }

  draw() {
    if (this.sprite) {
      this.clear()
      this.setPosition()
      ctx.drawImage(this.sprite, this.positionX, this.positionY)
    }
  }
}

class Projectile {
  constructor(type, positionX, positionY, velocity) {
    this.positionX = positionX
    this.positionY = positionY
    this.spriteWidth = 5
    this.spriteHeight = 17
    this.velocity = velocity
    this.type = type
    if (type == 1) {
      this.spriteLenght = 2
    } else if (type == 2) {
      this.spriteLenght = 8
    }
    this.actualFrame = 0
    const sprite = new Image()
    sprite.src = `./assets/sprites/projectile${type}.png`
    sprite.onload = () => {
      this.sprite = sprite
    }
  }
  draw() {
    if (this.sprite) {
      ctx.drawImage(
        this.sprite,
        this.spriteWidth * this.actualFrame,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.positionX,
        this.positionY,
        this.spriteWidth,
        this.spriteHeight
      )
    }
    if (this.actualFrame == this.spriteLenght) {
      this.actualFrame = 0
    } else {
      this.actualFrame++
    }

    if (this.type == 2) {
      this.actualFrame = Math.floor(this.spriteLenght * Math.random() + 1)
    }
  }
  clear() {
    ctx.fillStyle = "#000"
    ctx.fillRect(
      this.positionX,
      this.positionY,
      this.spriteWidth,
      this.spriteHeight
    )
  }
  update() {
    const newPositionY = this.positionY + this.velocity * 6
    ctx.fillStyle = "#000"
    ctx.fillRect(this.positionX, this.positionY, 10, 17)
    if (newPositionY < 450 && newPositionY > 60) {
      this.positionX = this.positionX
      this.positionY = newPositionY
      this.draw()
    } else {
      return "remove"
    }
  }
}
class Enemy {
  constructor(type) {
    if (type == 1) {
      this.spriteWidth = 16
    } else if (type == 2) {
      this.spriteWidth = 22
    } else {
      this.spriteWidth = 24
    }
    this.spriteHeight = 16
    this.actualFrame = 0
    this.status = "alive"
    const sprite = new Image()
    sprite.src = `./assets/sprites/enemy${type}.png`
    sprite.onload = () => {
      this.sprite = sprite
    }
    this.explodeSprite = new Image()
    this.explodeSprite.src = "./assets/sprites/explosion.png"
  }
  explosionSound = new Audio("./assets/sounds/invaderkilled.wav")
  shot() {
    const Xaxis = this.positionX + this.spriteWidth / 2
    const Yaxis = this.positionY + this.spriteHeight + 2
    const projectile = new Projectile(1, Xaxis, Yaxis, 1)
    enemyProjectiles.push(projectile)
  }
  clear() {
    ctx.fillStyle = "#000"
    ctx.fillRect(
      this.positionX,
      this.positionY,
      this.spriteWidth,
      this.spriteHeight
    )
  }
  explode() {
    this.clear()
    this.explosionSound.play()
    this.status = "dead"
    this.sprite = this.explodeSprite
    this.spriteHeight = 14
    this.spriteWidth = 24
    this.draw()
    points += 100
    setTimeout(() => {
      this.clear()
    }, 500)
  }
  update(positionX, positionY) {
    if (this.sprite && this.status == "alive") {
      this.clear()
      this.positionX = positionX
      this.positionY = positionY
      this.draw()
    }
    if (this.actualFrame == 0) this.actualFrame++
    else this.actualFrame--
  }
  checkColisions() {}
  draw() {
    ctx.drawImage(
      this.sprite,
      this.spriteWidth * this.actualFrame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.positionX,
      this.positionY,
      this.spriteWidth,
      this.spriteHeight
    )
  }
}

class Ufo {
  constructor() {
    this.positionX = canvasWidth
    this.positionY = 100
    this.velocity = -1
    this.delaySpawn()
    const sprite = new Image()
    sprite.src = "./assets/sprites/enemy-ship.png"
    sprite.onload = () => {
      this.spriteAlive = sprite
      this.sprite = this.spriteAlive
    }

    this.spriteExplosion = new Image()
    this.spriteExplosion.src = "./assets/sprites/ship-explosion.png"
  }
  flySound = new Audio("./assets/sounds/ufo_lowpitch.wav")
  explosionSound = new Audio("./assets/sounds/ufo_highpitch.wav")
  spriteHeight = 16
  spriteWidth = 32
  visible = false
  explode() {
    this.visible = false
    this.explosionSound.play()
    this.flySound.pause()
    this.clear()
    this.sprite = this.spriteExplosion
    this.spriteWidth = 42
    this.spriteHeight = 16
    this.draw()
    setTimeout(() => {
      this.clear()
      this.sprite = this.spriteAlive
      this.spriteHeight = 16
      this.spriteWidth = 32
      this.delaySpawn()
    }, 500)
  }
  delaySpawn() {
    setTimeout(() => {
      this.visible = true
      this.positionX = canvasWidth
      this.flySound.loop = true
      this.flySound.play()
    }, Math.floor(Math.random() * 40000))
  }

  clear() {
    ctx.fillStyle = "#000"
    ctx.fillRect(
      this.positionX,
      this.positionY,
      this.spriteWidth,
      this.spriteHeight
    )
  }

  update() {
    if (this.visible) {
      this.clear()
      const newPosition = this.positionX + this.velocity * 5
      if (newPosition > -32) {
        this.positionX = newPosition
        this.draw()
      } else {
        this.visible = false
        this.flySound.pause()
        this.delaySpawn()
      }
    }
  }

  draw() {
    if (this.sprite) {
      ctx.drawImage(this.sprite, this.positionX, this.positionY)
    }
  }
}

class EnemyColumn {
  constructor(positionX) {
    this.positionX = positionX
    this.enemies = [
      new Enemy(3),
      new Enemy(3),
      new Enemy(2),
      new Enemy(2),
      new Enemy(1),
    ]
  }
  status = "alive"
  positionY = 300
  checkStatus() {
    if (this.enemies.every((enemy) => enemy.status == "dead")) {
      this.status = "dead"
    } else {
      this.status = "alive"
    }
  }
  update(velocity) {
    this.checkStatus()
    if (this.status == "alive") {
      this.enemies.forEach((enemy, index) => {
        setTimeout(() => {
          enemy.update(this.positionX, this.positionY - index * 40)
        }, index * 100)
      })
    }
    this.positionX += velocity * 10
  }
}

class EnemyWave {
  constructor(velocity) {
    this.velocity = velocity
    this.columns = [
      new EnemyColumn(50),
      new EnemyColumn(100),
      new EnemyColumn(150),
      new EnemyColumn(200),
      new EnemyColumn(250),
      new EnemyColumn(300),
      new EnemyColumn(350),
    ]
    this.columnsStatus = [
      "alive",
      "alive",
      "alive",
      "alive",
      "alive",
      "alive",
      "alive",
    ]
  }

  leftLimit = 30
  rightLimit = canvasWidth - 30

  update() {
    if (!this.columnsStatus.every((status) => status == "dead")) {
      // Get columns positions
      let lastColumnPositionX =
        this.columns[this.columnsStatus.lastIndexOf("alive")].positionX + 24
      let firstColumnPositionX =
        this.columns[this.columnsStatus.indexOf("alive")].positionX

      // Check if columns are out of screen and change the velocity
      if (this.velocity == -1 && firstColumnPositionX < this.leftLimit) {
        this.velocity = 1
      } else if (this.velocity == 1 && lastColumnPositionX > this.rightLimit) {
        this.velocity = -1
      }
    }

    this.columns.forEach((column, index) => {
      if (column.status == "alive") {
        column.update(this.velocity)
      } else {
        this.columnsStatus[index] = "dead"
      }
    })
  }
}

let points = 0
clearScreen()
printHud("000000", "15000", "3")

const player = new Player()
const ismoving = false

const ufo = new Ufo()
const enemyGrid = new EnemyWave(1)

// collision detection
const checkEnemyColisions = () => {
  if (playerProjectiles.length > 0) {
    playerProjectiles.forEach((projectile, projectileIndex) => {
      enemyGrid.columns.forEach((column, columnIndex) => {
        if (
          projectile.positionX + projectile.spriteWidth >= column.positionX &&
          projectile.positionX <= column.positionX + 24
        ) {
          column.enemies.forEach((enemy, enemyIndex) => {
            if (enemy.status == "alive") {
              if (
                projectile.positionX + projectile.spriteWidth <=
                  enemy.positionX +
                    enemy.spriteWidth +
                    projectile.spriteWidth &&
                projectile.positionX >= enemy.positionX - projectile.spriteWidth
              ) {
                if (
                  projectile.positionY >=
                    enemy.positionY - projectile.spriteHeight &&
                  projectile.positionY + projectile.spriteHeight <=
                    enemy.positionY +
                      enemy.spriteHeight +
                      projectile.spriteHeight
                ) {
                  playerProjectiles.splice(projectileIndex, 1)
                  projectile.clear()
                  enemy.explode()
                }
              }
            }
          })
        }
      })
    })
  }
}
const checkPlayerColisions = () => {
  if (enemyProjectiles.length > 0) {
    enemyProjectiles.forEach((projectile, projectileIndex) => {
      if (
        projectile.positionY + projectile.spriteHeight >= player.positionY &&
        projectile.positionY + projectile.spriteHeight <=
          player.positionY + player.spriteHeight
      ) {
        if (
          projectile.positionX + projectile.spriteWidth >= player.positionX &&
          projectile.positionX <= player.positionX + player.spriteWidth
        ) {
          enemyProjectiles.splice(projectileIndex, 1)
          player.explode()
        }
      }
    })
  }
}
const checkShipColisions = () => {
  if (ufo.visible) {
    playerProjectiles.forEach((projectile, projectileIndex) => {
      if (
        projectile.positionY <= ufo.positionY + ufo.spriteHeight &&
        projectile.positionY + projectile.spriteHeight >= ufo.positionY
      ) {
        if (
          projectile.positionX + projectile.spriteWidth >= ufo.positionX &&
          projectile.positionX <= ufo.positionX + ufo.spriteWidth
        ) {
          ufo.explode()
          projectile.clear()
          playerProjectiles.splice(projectileIndex, 1)
        }
      }
    })
  }
}

// controls
window.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowLeft" || key == "a") {
    player.velocity = -1
  } else if (key == "ArrowRight" || key == "d") {
    player.velocity = 1
  } else if (key == "x") {
    player.shot()
  }
})

window.addEventListener("keyup", ({ key }) => {
  if (player.velocity != 0) {
    if (key == "ArrowLeft" || (key == "a" && player.velocity == -1)) {
      player.velocity = 0
    } else if (key == "ArrowRight" || (key == "d" && player.velocity == 1)) {
      player.velocity = 0
    }
  }
})

// loops
setInterval(() => {
  checkPlayerColisions()
}, 50)

setInterval(() => {
  if (ufo.visible) {
    checkShipColisions()
  }
  checkEnemyColisions()
}, 40)

setInterval(() => {
  player.draw()
  playerProjectiles.forEach((projectil, index) => {
    if (projectil.update() == "remove") {
      playerProjectiles.splice(index, 1)
    }
  })
  enemyProjectiles.forEach((projectil, index) => {
    if (projectil.update() == "remove") {
      enemyProjectiles.splice(index, 1)
    }
  })

  ufo.update()
}, 40)

setInterval(() => {
  enemyGrid.update()
}, 500)
