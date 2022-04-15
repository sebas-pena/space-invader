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
    ctx.font = "20px Arcade"
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
  }
}

class EnemyTier2 extends Enemy {
  constructor(positionX, positionY) {
    super(positionX, positionY, 22, 16)
    this.sprite = new Image()
    this.sprite.src = "./assets/sprites/enemy2.png"
  }
}

class EnemyTier3 extends Enemy {
  constructor(positionX, positionY) {
    super(positionX, positionY, 16, 16)
    this.sprite = new Image()
    this.sprite.src = "./assets/sprites/enemy1.png"
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
    this.enemies.forEach((enemy) => {
      enemy.draw()
    })
    this.positionX = positionX
    this.positionY = positionY
  }
  status = "alive"
  update(dX, dY) {
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
  draw() {
    this.enemies.forEach((enemy) => {
      enemy.draw()
    })
  }
}

class EnemyWave {
  constructor(positionX, positionY) {
    this.enemies = [
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

  clear() {
    ctx.fillStyle = "#000"
    ctx.fillRect(this.positionX, this.positionY, 400, 300)
  }
  draw() {
    this.clear()
    this.enemies
      .filter((column) => column.status == "alive")
      .forEach((column) => {
        column.draw()
      })
  }

  update() {
    let firstColumnPosition =
      this.enemies[this.columnsStatus.indexOf("alive")].positionX
    let lastColumnPosition =
      this.enemies[this.columnsStatus.lastIndexOf("alive")].positionX + 24

    if (lastColumnPosition > canvasWidth - 30) {
      this.velocity = -1
    } else if (firstColumnPosition < 30) {
      this.velocity = 1
    }
    this.positionX += 20 * this.velocity
  }
}

class Game {
  constructor() {
    this.hud = new Hud(10000, 3, 1, 15000)
    this.player = new Player()
    this.hud.initialize()
    this.player.draw()
    this.enemyWave = new EnemyWave(30, 100)
    setInterval(() => {
      this.enemyWave.draw()
    }, 30)
    setInterval(() => {
      this.enemyWave.update()
    }, 1000)
  }

  update() {
    this.player.draw()
    this.enemyWave.update()
  }
}

// collision detection OLD
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
