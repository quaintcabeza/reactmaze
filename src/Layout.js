import { Map } from 'immutable'
import Model from './Model';
import Util from './Util';

const GameObject = Model.GameObject;
const Mouse = Model.Mouse;
const Portal = Model.Portal;
const Cell = Model.Cell;

class EndGameLayout {
  constructor(winner, maze, mice, cheese, portals) {
    this.winner = winner // MouseColor
    this.maze = maze;
    this.mice = mice; // Map[MouseColor, Cell]
    this.cheese = cheese; // Cell
    this.portals = portals; // Map[MouseColor, Set[Cell]]
  }

  moveMouse(color, dir) {
    return this;
  }
}

class Layout {
  constructor(maze, mice, cheese, portals) {
    this.maze = maze;
    this.mice = mice; // Map[MouseColor, Cell]
    this.cheese = cheese; // Cell
    this.portals = portals; // Map[MouseColor, Set[Cell]]

    this.mousePositions = Map(
      mice.flatMap((cell, color) => { return [[cell, new Mouse(color)]]; })
    );

    this.portalPositions = Map(
      portals.flatMap((cells, color) => {
        return cells.map((cell) => { return [cell, new Portal(color)]; });
      })
    );
  }

  getRandomCell() {
    const maze = this.maze;
    const cell = new Cell(Util.randomInt(maze.rows), Util.randomInt(maze.cols));
    if (Util.mapHas(this.mousePositions, cell) ||
        Util.mapHas(this.portalPositions, cell) ||
        this.cheese.equals(cell)) {
      // try again
      return this.getRandomCell();
    }
    else {
      return cell;
    }
  }

  whatsToThe(dir) {
    const layout = this;
    const maze = this.maze;
    return {
      of: (cell) => {
        const obj = maze.whatsToThe(dir).of(cell)
        if (obj === GameObject.WALL) {
          return GameObject.WALL;
        }

        const newCell = Cell.toThe(dir).of(cell)
        if (Util.mapHas(layout.mousePositions, newCell)) {
          return GameObject.MOUSE;
        }
        else if (layout.cheese.equals(newCell)) {
          return GameObject.CHEESE;
        }
        else if (Util.mapHas(layout.portalPositions, newCell)) {
          return GameObject.PORTAL;
        }
        return GameObject.CELL;
      }
    }
  }

  moveMouse(color, dir) {
    const mice = this.mice
    const pos = mice.get(color)
    const newPos = Cell.toThe(dir).of(pos)
    const obj = this.whatsToThe(dir).of(pos)

    switch (obj) {
      case GameObject.WALL:
        return this;
      case GameObject.MOUSE:
        return this;
      case GameObject.CHEESE:
        return new EndGameLayout(color,
                                 this.maze,
                                 mice.set(color, this.cheese),
                                 this.cheese,
                                 this.portals);
      case GameObject.PORTAL:
        const portal = Util.mapGet(this.portalPositions, newPos)
        const portalsForColor = Util.mapGet(this.portals, portal.color)
        const randomCell = this.getRandomCell()
        return new Layout(this.maze,
                          mice.set(color, newPos).set(portal.color, randomCell),
                          this.cheese,
                          this.portals.set(portal.color, portalsForColor.remove(newPos)));
      default: // CELL
        return new Layout(this.maze,
                          mice.set(color, newPos),
                          this.cheese,
                          this.portals);
    }
  }
}

export default Layout;
