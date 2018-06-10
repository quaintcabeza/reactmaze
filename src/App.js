import React, { Component } from 'react';
import './App.css';
import Loader from './Loader.js';
import Controller from './Controller.js';
import MazeGenerator from './MazeGenerator.js';

const cols = 20;
const rows = 15;
const aspect = cols/rows;
const height = window.innerHeight;
const width = height * aspect;

class App extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: width,
        height: height,
      }
    };
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  render() {
    return (
      <div>
        <canvas ref="canvas" tabIndex="1" onKeyPress={this.handleKeyPress}
          width={ this.state.screen.width }
          height={ this.state.screen.height }
        />
      </div>
    );
  }

  componentDidMount() {
    const me = this
    this.maze = MazeGenerator.runDFS(15, 20, true);

    const loader = new Loader();
    const canvas = this.refs.canvas;
    const painterPromise = loader.loadPainter(this.refs.canvas);
    painterPromise
    .then((painter) => {
      me.controller = new Controller(me.maze, painter)
      canvas.focus()
    });
  }

  handleKeyPress(e) {
    this.controller.handleKey(e.key)
  }
}

export default App;
