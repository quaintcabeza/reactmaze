import brownMousePng from './img/brown_mouse.png';
import whiteMousePng from './img/white_mouse.png';
import cheesePng from './img/cheese.png';
import Painter from './Painter.js';
import Model from './Model';

const MouseColor = Model.MouseColor;

class Loader {
  loadImage(src) {
    const promise = new Promise(function (resolve, reject) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        resolve(img);
      }
      img.onerror = (ex) => {
        reject(ex)
      }
    })
    return promise;
  }

  loadPainter(canvas) {
    const self = this;
    return Promise.all([
      self.loadImage(brownMousePng),
      self.loadImage(whiteMousePng),
      self.loadImage(cheesePng)
    ])
    .then((images) => {
      const miceImages = {}
      miceImages[MouseColor.BROWN] = images[0]
      miceImages[MouseColor.WHITE] = images[1]
      return new Painter(canvas, miceImages, images[2]);
    });
  }
}

export default Loader;
