const canvas = document.querySelector("canvas")

const ctx = canvas.getContext("2d")
const canvasHeight = 500
const canvasWidth = 500

const clearScreen = () => {
  ctx.rect(0, 0, canvasWidth, canvasHeight)
  ctx.fill()
  ctx.strokeStyle = "#20FF20"
  ctx.lineWidth = 5
  ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
}

const printHud = (score, hiScore, lives) => {
  ctx.fillStyle = "#fff"
  ctx.font = "400 20px Arcade"
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

clearScreen()
printHud(200, 5000, 2)
