import { range } from 'lodash';
import Model from './Model';

const MouseColor = Model.MouseColor;

const backgroundColor = "#e8e8e8"
const gridLineColor = "#c0c0c0";
const wallColor = "#000000";
const padding = 10;
const mouseColorToColor = {}
mouseColorToColor[MouseColor.BROWN] = "#d2b486"
mouseColorToColor[MouseColor.WHITE] = "white"

class PainterHelper {
  constructor(canvas, layout) {
    this.layout = layout
    const maze = layout.maze
    this.renderer = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    this.maze = maze;

    const cellX = width / maze.cols;
    const cellY = height / maze.rows;

    this.dimensions = {
      width: width,
      height: height,
      cellX: cellX,
      cellY: cellY,
      imgX: cellX - 2 * padding,
      imgY: cellY - 2 * padding
    };
  }

  drawBackground() {
    this.renderer.fillStyle = backgroundColor
    this.renderer.fillRect(0, 0, this.dimensions.width, this.dimensions.height)
  }

  drawBorder() {
    this.renderer.strokeStyle = wallColor
    this.renderer.strokeRect(0, 0, this.dimensions.width, this.dimensions.height)
  }

  drawGridLines() {
    const dim = this.dimensions;
    const renderer = this.renderer;
    const maze = this.maze;

    renderer.strokeStyle = gridLineColor

    // horizontal grid lines
    range(1, maze.ROWS).forEach((row) => {
      renderer.beginPath()
      renderer.moveTo(0, row * dim.cellY)
      renderer.lineTo(dim.width, row * dim.cellY)
      renderer.stroke()
    });
    // vertical grid lines
    range(1, maze.COLS).forEach((col) => {
      renderer.beginPath()
      renderer.moveTo(col * dim.cellX, 0)
      renderer.lineTo(col * dim.cellX, dim.height)
      renderer.stroke()
    })
  }

  drawWalls(walls) {
    const dim = this.dimensions;
    const renderer = this.renderer;
    const maze = this.maze;

    renderer.strokeStyle = wallColor

    maze.walls.filter((wall) => {
      return (wall.cell1.col === wall.cell2.col); // horizontal walls
    }).forEach((wall) => {
      const cell = wall.cell2;
      renderer.beginPath();
      renderer.moveTo(cell.col * dim.cellX, cell.row * dim.cellY);
      renderer.lineTo((cell.col + 1) * dim.cellX, cell.row * dim.cellY);
      renderer.stroke();
    });

    maze.walls.filter((wall) => {
      return (wall.cell1.row === wall.cell2.row); // vertical walls
    }).forEach((wall) => {
      const cell = wall.cell2;
      renderer.beginPath();
      renderer.moveTo(cell.col * dim.cellX, cell.row * dim.cellY)
      renderer.lineTo(cell.col * dim.cellX, (cell.row + 1) * dim.cellY)
      renderer.stroke();
    });
  }

  drawCircle(color, cell) {
    const dim = this.dimensions;
    const renderer = this.renderer;

    renderer.fillStyle = color
    renderer.strokeStyle = wallColor
    renderer.beginPath()
    renderer.arc(
      cell.col * dim.cellX + dim.cellX / 2,
      cell.row * dim.cellY + dim.cellY / 2,
      10,
      0,
      2 * Math.PI)
    renderer.fill()
    renderer.stroke()
  }

  drawImage(img, cell) {
    const dim = this.dimensions;
    this.renderer.drawImage(
      img,
      cell.col * dim.cellX + padding,
      cell.row * dim.cellY + padding,
      dim.imgX,
      dim.imgY
    );
  }

  drawPortals() {
    const helper = this;
    this.layout.portals.forEach((cells, color) => {
      cells.forEach((cell) => {
        helper.drawCircle(mouseColorToColor[color], cell)
      })
    })
  }

  drawMice(miceImages) {
    const helper = this
    this.layout.mice.forEach((cell, color) => {
      const image = miceImages[color]
      helper.drawImage(image, cell)
    })
  }

  drawCheese(cheeseImg) {
    this.drawImage(cheeseImg, this.layout.cheese)
  }
}

class Painter {
  constructor(canvas, miceImages, cheeseImg) {
    this.canvas = canvas
    this.miceImages = miceImages
    this.cheeseImg = cheeseImg
  }

  drawLayout(layout) {
    const helper = new PainterHelper(this.canvas, layout)
    helper.drawBackground();
    helper.drawBorder();
    helper.drawGridLines();
    helper.drawWalls();
    helper.drawPortals();
    helper.drawCheese(this.cheeseImg);
    helper.drawMice(this.miceImages)
  }
}

export default Painter;
