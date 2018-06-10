import { List, Range, Set } from 'immutable'
import Util from './Util';


const GameObject = {
  CELL: 'Cell',
  WALL: 'Wall',
  MOUSE: 'Mouse',
  CHEESE: 'Cheese',
  PORTAL: 'Portal'
}


const Dir = {
  TOP: 'Top',
  BOTTOM: 'Bottom',
  LEFT: 'Left',
  RIGHT: 'Right'
}


const MouseColor = {
  BROWN: 'Brown',
  WHITE: 'White'
}


class Mouse {
  constructor(color) {
    this.color = color;
  }
}


class Portal {
  constructor(color) {
    this.color = color;
  }
}


class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  equals(other) {
    return (this.row === other.row && this.col === other.col);
  }

  // cell2 = Cell.toThe(Dir.LEFT).of(cell)
  static toThe(dir) {
    return {
      of: (cell) => {
        switch(dir) {
          case Dir.TOP:
            return new Cell(cell.row - 1, cell.col);
          case Dir.BOTTOM:
            return new Cell(cell.row + 1, cell.col);
          case Dir.LEFT:
            return new Cell(cell.row, cell.col - 1);
          default: // RIGHT
            return new Cell(cell.row, cell.col + 1);
        }
      }
    }
  }
}


class Wall {
  constructor(cell1, cell2) {
    // DO NOT USE DIRECTLY
    this.cell1 = cell1;
    this.cell2 = cell2;
  }

  equals(other) {
    return (this.cell1.equals(other.cell1) && this.cell2.equals(other.cell2));
  }

  // wall = Wall.toThe(Dir.LEFT).of(cell)
  static toThe(dir) {
    return {
      of: (cell) => {
        const other = Cell.toThe(dir).of(cell)
        switch(dir) {
          case Dir.TOP:
            return new Wall(other, cell);
          case Dir.BOTTOM:
            return new Wall(cell, other);
          case Dir.LEFT:
            return new Wall(other, cell);
          default: // RIGHT
            return new Wall(cell, other);
        }
      }
    }
  }

  static between(cell1, cell2) {
    // Assume cells are neighbors
    if (cell1.row < cell2.row || cell1.col < cell2.col) {
      return new Wall(cell1, cell2)
    }
    else {
      return new Wall(cell2, cell1)
    }
  }
}


class Maze {
  constructor(rows, cols, walls) {
    // DO NOT USE DIRECTLY
    this.rows = rows;
    this.cols = cols;
    this.walls = walls;
  }

  static create(rows, cols, walled) {
    if (walled) {
      const walls = Set(Range(0, rows).flatMap((row) => {
        return Range(0, cols).flatMap((col) => {
          const cell = new Cell(row, col);
          return [Wall.toThe(Dir.RIGHT).of(cell), Wall.toThe(Dir.BOTTOM).of(cell)].filter((wall) => {
            return (wall.cell2.row < rows && wall.cell2.col < cols);
          });
        });
      }));
      return new Maze(rows, cols, walls);
    }
    else {
      const walls = Set();
      return new Maze(rows, cols, walls);
    }
  }

  isOutOfBounds(cell) {
    return (cell.row < 0 || cell.row >= this.rows ||
            cell.col < 0 || cell.col >= this.cols)
  }

  // maze.whatsToThe(Dir.LEFT).of(cell)
  whatsToThe(dir) {
    const maze = this;
    return {
      of: (cell) => {
        const otherCell = Cell.toThe(dir).of(cell);
        const wall = Wall.toThe(dir).of(cell);
        if (maze.isOutOfBounds(otherCell) || Util.setHas(maze.walls, wall)) {
          return GameObject.WALL;
        }
        else {
          return GameObject.CELL;
        }
      }
    }
  }

  breakWall(wall) {
    return new Maze(this.rows,
                    this.cols,
                    this.walls.filter((w) => { return !wall.equals(w) }));
  }

  getNeighbors(cell) {
    const maze = this
    return List([
      Cell.toThe(Dir.TOP).of(cell),
      Cell.toThe(Dir.BOTTOM).of(cell),
      Cell.toThe(Dir.LEFT).of(cell),
      Cell.toThe(Dir.RIGHT).of(cell),
    ]).filter((c) => { return !maze.isOutOfBounds(c) })
  }
}


const Model = {
  GameObject: GameObject,
  Dir: Dir,
  MouseColor: MouseColor,
  Mouse: Mouse,
  Portal: Portal,
  Cell: Cell,
  Wall: Wall,
  Maze: Maze
}


export default Model;

