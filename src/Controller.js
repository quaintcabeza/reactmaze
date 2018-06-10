import { Map, Range, Set } from 'immutable'
import Layout from './Layout';
import Model from './Model';
import Util from './Util';

const Dir = Model.Dir;
const MouseColor = Model.MouseColor;
const Cell = Model.Cell;


class GenerateLayout {
  constructor(rows, cols, numPortals) {
    this.rows = rows
    this.cols = cols
    this.numPortals = numPortals

    this.mice = Map([
      [MouseColor.BROWN, new Cell(0, 0)],
      [MouseColor.WHITE, new Cell(0, cols - 1)]
    ]);

    // put cheese anywhere but first row
    this.cheese = new Cell(Util.randomInt(rows - 1) + 1, Util.randomInt(cols))
    this.portals = Map([
      [MouseColor.BROWN, this.generatePortals()],
      [MouseColor.WHITE, this.generatePortals()]
    ]);
  }

  generatePortals() {
    const controller = this
    return Set(Range(0, this.numPortals).map(() => {
      return new Cell(Util.randomInt(controller.rows), Util.randomInt(controller.cols))
    }));
  }
}

class Controller {
  constructor(maze, painter) {
    this.maze = maze
    this.painter = painter

    const numPortals = 8
    const initialState = new GenerateLayout(maze.rows, maze.cols, numPortals)
    this.layout = new Layout(maze, initialState.mice, initialState.cheese, initialState.portals)
    this.keyMap = Map({
      w: { color: MouseColor.BROWN, dir: Dir.TOP },
      s: { color: MouseColor.BROWN, dir: Dir.BOTTOM },
      a: { color: MouseColor.BROWN, dir: Dir.LEFT },
      d: { color: MouseColor.BROWN, dir: Dir.RIGHT },
      i: { color: MouseColor.WHITE, dir: Dir.TOP },
      k: { color: MouseColor.WHITE, dir: Dir.BOTTOM },
      j: { color: MouseColor.WHITE, dir: Dir.LEFT },
      l: { color: MouseColor.WHITE, dir: Dir.RIGHT },
    })

    painter.drawLayout(this.layout)
  }

  handleKey(key) {
    if (this.keyMap.has(key)) {
      const action = this.keyMap.get(key)
      const newLayout = this.layout.moveMouse(action.color, action.dir)

      this.layout = newLayout
      this.painter.drawLayout(newLayout)
    }
  }
}

export default Controller;
