import { Range, Set } from 'immutable'
import Util from './Util';
import Model from './Model';

const Maze = Model.Maze;
const Cell = Model.Cell;
const Wall = Model.Wall;

class GeneratorState {
  constructor(maze, unvisited, visited) {
    this.maze = maze
    this.unvisited = unvisited
    this.visited = visited
  }

  static create(maze) {
    const unvisited = Set(Range(0, maze.rows).flatMap((row) => {
      return Range(0, maze.cols).map((col) => {
        const cell = new Cell(row, col)
        return cell
      })
    }));
    return new GeneratorState(maze, unvisited, Set())
  }

  visit(cell) {
    return new GeneratorState(this.maze,
                              this.unvisited.filter((c) => { return !cell.equals(c) } ),
                              this.visited.add(cell))
  }

  connect(cell1, cell2) {
    return new GeneratorState(this.maze.breakWall(Wall.between(cell1, cell2)),
                              this.unvisited,
                              this.visited)
  }

  dfs(current) {
    const state = this
    const maze = this.maze

    // Get unvisited neighbors of the 'current' cell
    const neighbors = maze.getNeighbors(current)
    const unvisitedNeighbors = neighbors.filter((n) => {
      return Util.setHas(state.unvisited, n)
    }).toList()

    if (unvisitedNeighbors.isEmpty()) {
      return this.visit(current)
    }
    else {
      // Get a random unvisited neighbor
      const randomNeighbor = Util.getRandomElement(unvisitedNeighbors)
      return this.visit(current).connect(current, randomNeighbor).dfs(randomNeighbor).dfs(current)
    }
  }
}

function runDFS(rows, cols) {
  // start with a maze that has all walls
  const allWalls = true
  const maze = Maze.create(rows, cols, allWalls)

  const state = GeneratorState.create(maze)
  const randomCell = new Cell(Util.randomInt(maze.rows), Util.randomInt(maze.cols))

  return state.dfs(randomCell).maze
}


const MazeGenerator = {
  runDFS: runDFS
}


export default MazeGenerator

