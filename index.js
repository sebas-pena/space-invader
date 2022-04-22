const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const canvasHeight = 500
const canvasWidth = 500

let playerProjectiles = []
let enemyProjectiles = []
let points = []

// preload assets

let game
const preloadAssets = (assets, cb) => {
  assets.images.forEach((image) => {
    let img = new Image()
    img.src = image
    img.onload = () => {
      assets.imagesLoaded++
      checkAssetsLoaded()
    }
  })

  assets.sounds.forEach((sound) => {
    let snd = new Image()
    snd.src = sound
    snd.onerror = () => {
      assets.soundsLoaded++
      checkAssetsLoaded()
    }
  })

  assets.fonts.forEach((font) => {
    let fnt = new FontFace(font.name, font.url)
    fnt.load().then(() => {
      document.fonts.add(fnt)
      assets.fontsLoaded++
      checkAssetsLoaded()
    })
  })

  let checkAssetsLoaded = () => {
    if (
      assets.imagesLoaded == assets.images.length &&
      assets.soundsLoaded == assets.sounds.length &&
      assets.fontsLoaded == assets.fonts.length
    ) {
      cb()
    }
  }
}

preloadAssets(
  {
    images: [
      "./assets/sprites/player.png",
      "./assets/sprites/player-projectile.png",
      "./assets/sprites/explosion.png",
      "./assets/sprites/enemy-ship.png",
      "./assets/sprites/enemy3.png",
      "./assets/sprites/enemy2.png",
      "./assets/sprites/enemy1.png",
      "./assets/sprites/ship-explosion.png",
      "./assets/images/logo-git.png",
    ],
    sounds: [
      "./assets/sounds/ufo_lowpitch.wav",
      "./assets/sounds/ufo_highpitch.wav",
      "./assets/sounds/explosion.wav",
      "./assets/sounds/shoot.wav",
    ],
    fonts: [{ name: "Arcade", url: "url('./assets/fonts/Arcade.ttf')" }],
    imagesLoaded: 0,
    soundsLoaded: 0,
    fontsLoaded: 0,
  },
  () => {
    game = new Game()
  }
)

class Hud {
  constructor(points, lives, level, highScore) {
    this.points = points
    this.lives = lives
    this.level = level
    this.highScore = highScore

    this.livesImg = new Image()
    this.livesImg.src = "./assets/sprites/player.png"

    this.logoGit = new Image()
    this.logoGit.src = "./assets/images/logo-git.png"
  }

  reset(points, lives, level, highScore) {
    this.points = points
    this.lives = lives
    this.level = level
    this.highScore = highScore
    this.printHighScore()
    this.printScore()
    this.printLives()
  }

  printScore() {
    ctx.fillStyle = "#fff"
    ctx.font = "20px Arcade"
    ctx.textAlign = "start"
    ctx.fillText("SCORE", 30, 30)
    ctx.font = "18px Arcade"
    ctx.fillText(this.points, 30, 50)
  }

  printHighScore() {
    ctx.fillStyle = "#fff"
    ctx.font = "20px Arcade"
    ctx.textAlign = "center"
    ctx.fillText("HIGH SCORE", canvas.width / 2, 30)
    ctx.font = "18px Arcade"
    ctx.fillText(this.highScore, canvasWidth / 2, 50)
  }

  printLives() {
    ctx.fillStyle = "#000"
    ctx.fillRect(30, canvasHeight - 35, 250, 35)
    ctx.fillStyle = "#fff"
    ctx.font = "20px Arcade"
    ctx.textAlign = "start"
    ctx.fillText(this.lives, 30, canvasHeight - 15)
    if (this.livesImg) {
      for (let i = 0; i < this.lives; i++) {
        ctx.drawImage(this.livesImg, 60 + i * 40, canvasHeight - 31)
      }
    }
  }

  updateScore() {
    ctx.fillStyle = "#000"
    ctx.textAlign = "start"
    ctx.fillRect(30, 30, 100, 20)
    ctx.fillStyle = "#fff"
    ctx.font = "18px Arcade"
    ctx.fillText(this.points, 30, 50)
  }

  updateHighScore() {
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    ctx.fillRect(canvasWidth / 2 - 100, 30, 200, 20)
    ctx.fillStyle = "#fff"
    ctx.font = "20px Arcade"
    ctx.fillText(this.points, canvasWidth / 2, 50)
  }

  initialize() {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    this.printScore()
    this.printHighScore()
    this.printLives()
    ctx.moveTo(30, canvasHeight - 40)
    ctx.strokeStyle = "#20FF20"
    ctx.lineWidth = 2
    ctx.lineTo(canvasWidth - 30, canvasHeight - 40)
    ctx.stroke()
    ctx.fillStyle = "#fff"
    ctx.textAlign = "end"
    ctx.drawImage(this.logoGit, canvasWidth - 180, canvasHeight - 32)
    ctx.fillText("SEBAS-PENA", canvasWidth - 30, canvasHeight - 13)
  }
}

class Entity {
  constructor(positionX, positionY, spriteWidth, spriteHeight) {
    this.positionX = positionX
    this.positionY = positionY
    this.spriteWidth = spriteWidth
    this.spriteHeight = spriteHeight
  }

  actualFrame = 1

  clear() {
    ctx.fillStyle = "#000"
    ctx.fillRect(
      this.positionX,
      this.positionY,
      this.spriteWidth,
      this.spriteHeight
    )
  }

  draw() {
    if (this.sprite) {
      this.clear()
      if (this.spriteLength == 1) {
        ctx.drawImage(this.sprite, this.positionX, this.positionY)
      } else {
        ctx.drawImage(
          this.sprite,
          this.spriteWidth * (this.actualFrame - 1),
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
  }
}

class Player extends Entity {
  constructor() {
    super(canvasWidth / 2 - 8, canvasHeight - 60, 30, 16)

    this.sprite = new Image()
    this.sprite.src = "./assets/sprites/player.png"
  }
  deadSound = new Audio("./assets/sounds/explosion.wav")
  shootSound = new Audio("./assets/sounds/shoot.wav")
  spriteLength = 1
  speed = 0

  shoot() {
    if (game.playerProjecile == null) {
      let shoot = new PlayerProjecile(this.positionX + 8)
      game.playerProjecile = shoot
    }
  }

  changePositionX() {
    if (
      this.positionX + this.speed > 30 &&
      this.positionX + this.speed + this.spriteWidth < canvasWidth - 30 &&
      this.speed != 0
    ) {
      this.clear()
      this.positionX += this.speed
    }
  }
  dead() {
    this.deadSound.play()
    this.clear()
    this.positionX = canvasWidth / 2 - 8
    this.draw()
  }
}

class Ufo extends Entity {
  constructor() {
    super(500, 100, 32, 14)

    this.sprite = new Image()
    this.sprite.src = "./assets/sprites/enemy-ship.png"

    this.spriteExplosion = new Image()
    this.spriteExplosion.src = "./assets/sprites/ship-explosion.png"

    this.visible = false
    this.delaySpawn()
    this.velocity = 1
  }
  spriteLength = 1
  flySound = new Audio("./assets/sounds/ufo_lowpitch.wav")
  deadSound = new Audio("./assets/sounds/ufo_highpitch.wav")

  delaySpawn() {
    setTimeout(() => {
      this.visible = true
      this.flySound.loop = true
      this.flySound.play()
    }, Math.floor(Math.random() * 40000))
  }
}

class Enemy extends Entity {
  constructor(positionX, positionY, spriteWidth, spriteHeight) {
    super(positionX, positionY, spriteWidth, spriteHeight)
    this.status = "alive"
    let deadSprite = new Image()
    deadSprite.src = `./assets/sprites/explosion.png`
    deadSprite.onload = () => {
      this.deadSprite = deadSprite
    }
  }
  deadSound = new Audio("./assets/sounds/explosion.wav")
  shot() {}
  spriteLength = 2
  status = "alive"
}

class EnemyTier1 extends Enemy {
  constructor(positionX, positionY) {
    super(positionX, positionY, 24, 16)
    this.sprite = new Image()
    this.sprite.src = "./assets/sprites/enemy3.png"
    this.points = 10
  }
}

class EnemyTier2 extends Enemy {
  constructor(positionX, positionY) {
    super(positionX, positionY, 22, 16)
    this.sprite = new Image()
    this.sprite.src = "./assets/sprites/enemy2.png"
    this.points = 20
  }
}

class EnemyTier3 extends Enemy {
  constructor(positionX, positionY) {
    super(positionX, positionY, 16, 16)
    this.sprite = new Image()
    this.sprite.src = "./assets/sprites/enemy1.png"
    this.points = 30
  }
}

class EnemyColumn {
  constructor(positionX, positionY) {
    this.enemies = [
      new EnemyTier3(positionX, positionY),
      new EnemyTier2(positionX, positionY + 40),
      new EnemyTier2(positionX, positionY + 80),
      new EnemyTier1(positionX, positionY + 120),
      new EnemyTier1(positionX, positionY + 160),
    ]
    this.draw()
    this.positionX = positionX
    this.positionY = positionY
  }
  status = "alive"
  update(dX, dY) {
    this.clear()
    this.positionX += dX
    this.positionY += dY
    this.enemies.forEach((enemy) => {
      enemy.positionX += dX
      enemy.positionY += dY
      if (enemy.actualFrame == enemy.spriteLength) {
        enemy.actualFrame = 1
      } else {
        enemy.actualFrame++
      }
    })
  }
  clear() {
    this.enemies.forEach((enemy) => {
      enemy.clear()
    })
  }
  draw() {
    this.enemies.forEach((enemy) => {
      if (enemy.status == "alive") {
        enemy.draw()
      }
    })
  }
}

class EnemyWave {
  constructor(positionX, positionY) {
    this.columns = [
      new EnemyColumn(positionX, positionY),
      new EnemyColumn(positionX + 40, positionY),
      new EnemyColumn(positionX + 80, positionY),
      new EnemyColumn(positionX + 120, positionY),
      new EnemyColumn(positionX + 160, positionY),
      new EnemyColumn(positionX + 200, positionY),
      new EnemyColumn(positionX + 240, positionY),
      new EnemyColumn(positionX + 280, positionY),
      new EnemyColumn(positionX + 320, positionY),
    ]
  }

  positionX = 30
  positionY = 100
  velocity = 1
  columnsStatus = [
    "alive",
    "alive",
    "alive",
    "alive",
    "alive",
    "alive",
    "alive",
    "alive",
    "alive",
  ]

  updateColumsStatus() {
    this.columnsStatus.forEach((status, index) => {
      if (status == "alive") {
        this.columns[index].enemies.every((enemy) => enemy.status == "dead")
          ? (this.columnsStatus[index] = "dead")
          : ""
      }
    })
  }

  clear() {
    ctx.fillStyle = "#000"
    ctx.fillRect(this.positionX, this.positionY, 400, 300)
  }
  draw() {
    let columnsAlive = this.columns.filter((column) => column.status == "alive")
    columnsAlive.forEach((column) => {
      column.draw()
    })
  }

  update() {
    this.updateColumsStatus()
    let firstColumnPosition =
      this.columns[this.columnsStatus.indexOf("alive")].positionX - 23
    let lastColumnPosition =
      this.columns[this.columnsStatus.lastIndexOf("alive")].positionX + 47
    if (
      (this.velocity < 0 && firstColumnPosition < 30) ||
      (this.velocity > 0 && lastColumnPosition > canvasWidth - 30)
    )
      this.velocity *= -1
    this.columns.forEach((column) => {
      column.update(this.velocity * 23, 0)
    })
  }
}

class PlayerProjecile extends Entity {
  constructor(positionX) {
    super(positionX, canvasHeight - 85, 5, 17)
    this.sprite = new Image()
    this.sprite.src = "./assets/sprites/player-projectile.png"
    this.velocity = -10
    this.positionY = canvasHeight - 85
    this.actualFrame = 1
    this.spriteLength = 5
    this.draw()
  }
  explode() {
    console.log("exploto")
  }
  update() {
    let newPositionY = this.positionY + this.velocity
    if (newPositionY > 60) {
      this.clear()
      this.positionY = newPositionY
      this.actualFrame = Math.floor(Math.random() * 5) + 1
      this.draw()
    } else {
      this.explode()
      game.playerProjecile = null
    }
  }
}

class EnemyProjectiles extends Entity {}

class Game {
  constructor() {
    this.hud = new Hud(0, 3, 1, 15000)
    this.player = new Player()
    this.hud.initialize()
    this.player.draw()
    this.enemyWave = new EnemyWave(30, 100)
    setInterval(() => {
      if (this.playerProjecile) {
        this.playerProjecile.update()
        this.checkEnemyColision()
      }
      if (this.player.speed != 0) {
        this.player.changePositionX()
        this.player.draw()
      }
      this.enemyWave.draw()
    }, 33)
    setInterval(() => {
      this.enemyWave.update()
    }, 1000)
  }

  playerProjecile = null
  enemiesProjectiles = []

  checkEnemyColision() {
    if (this.playerProjecile) {
      let projectileX = this.playerProjecile.positionX

      let columnInTrajectory = this.enemyWave.columns.findIndex(
        (column) =>
          projectileX + 5 > column.positionX &&
          projectileX < column.positionX + 24
      )

      if (columnInTrajectory != -1) {
        this.enemyWave.columns[columnInTrajectory].enemies.forEach((enemy) => {
          if (enemy.status == "alive" && this.playerProjecile != null) {
            if (this.detectColisions(this.playerProjecile, enemy)) {
              enemy.clear()
              enemy.status = "dead"
              this.hud.points += enemy.points
              this.hud.updateScore(this.points)
              this.playerProjecile.clear()
              this.playerProjecile = null
            }
          }
        })
      }
    }
  }
  detectColisions(projectile, entity) {
    if (
      projectile.positionX + projectile.spriteWidth >= entity.positionX &&
      projectile.positionX <= entity.positionX + entity.spriteWidth &&
      projectile.positionY + projectile.spriteHeight >= entity.positionY &&
      projectile.positionY <= entity.positionY + 16
    ) {
      return true
    } else {
      return false
    }
  }

  update() {
    if (this.playerIsMoving) this.player.draw()
    this.enemyWave.update()
  }
}

// game controls
const keyDownHandler = (e) => {
  if (e.keyCode == 68) {
    game.player.speed = 5
  } else if (e.keyCode == 65) {
    game.player.speed = -5
  } else if (e.keyCode == 32) {
    game.player.shoot()
  }
}

const keyUpHandler = (e) => {
  if (
    (e.keyCode == 65 && game.player.speed == -5) ||
    (e.keyCode == 68 && game.player.speed == 5)
  ) {
    game.player.speed = 0
  }
}

window.addEventListener("keydown", keyDownHandler)
window.addEventListener("keyup", keyUpHandler)
