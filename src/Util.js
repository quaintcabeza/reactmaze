function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomElement(list) {
  return list.get(randomInt(list.size))
}

function setHas(set, key) {
  let res = false;
  set.forEach((i) => {
    if (i.equals(key)) res = true;
  })
  return res
}

function mapHas(map, key) {
  let res = false;
  map.forEach((i, k) => {
    if (k.equals(key)) res = true;
  })
  return res
}

function mapGet(map, key) {
  let res = null;
  map.forEach((i, k) => {
    if (typeof k.equals === 'function') {
      if (k.equals(key)) res = i;
    }
    else {
      if (k === key) res = i;
    }
  })
  return res
}

const Util = {
  randomInt: randomInt,
  getRandomElement: getRandomElement,
  setHas: setHas,
  mapHas: mapHas,
  mapGet: mapGet
}


export default Util

