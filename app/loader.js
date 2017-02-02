import * as d3 from 'd3';
import {Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import {loaders as pixiLoaders} from 'pixi.js';
import coins from 'app/stores/coins';
import Coin from 'app/stores/Coin';

var loader = {},
    dispatch = d3.dispatch('coinsLoaded', 'actorsLoaded', 'linksLoaded', 'coinsProgress');

var numCoins = 26705;

loader.load = function() {
  var coinsQ = d3.queue(),
      actorsQ = d3.queue(),
      linksQ = d3.queue();


  loadCoins();

  return loader;
}

/*
* Loads coins.csv and afterwards the corresponding spritesheets
*/
function loadCoins() {
  loadCsv("data/csv/coins.csv", function(err, coinsData) {
    if(err) console.log(err);
    else {
      var fileNames = createSpriteFileNames("coins", 31, coinsData.length, 5000);
      loadSpriteSheets(fileNames, function() {
        dispatch.call('coinsLoaded', loader);
      }, function(spriteLoader, resource) {
        dispatch.call('coinsProgress');
        createCoins(spriteLoader, resource, coinsData);
      });
    }
  });
}

/*
* Creates coins sprites, adds its data to it and adds the coins to the coinsstore
* loader should be responsible for creating the coins because all the necessary data is here.
* another component adds them to the canvas and gives them behavior
*/
function createCoins(spriteLoader, resource, coinsData) {
  var extent = resource.name.split("_").map(function(number) {return parseInt(number)}).slice(1,3);
  d3.range(extent[0], extent[1]).map(function(coinIndex) {
    //if(coinIndex > 100) return;
    var coinData = coinsData[coinIndex],
        texture = new Texture(spriteLoader.resources[resource.name].texture),
        rectangle = new Rectangle(coinData.x, coinData.y, coinData.width, coinData.height);
    texture.frame = rectangle;
    coins.add(Coin(texture, coinData));
  });
}

/*
* Loads a bunch of sprite sheets from alist of filenames
*/
function loadSpriteSheets(fileNames, onComplete, onProgress) {
  var spriteLoader = new pixiLoaders.Loader();
  fileNames.forEach(function(fileSpec) {
    spriteLoader.add(fileSpec);
  })

  spriteLoader.load(function(loader, results) {
    onComplete(null);
  })
  .onProgress.add(onProgress);
}

/*
* Create a list of sprite file names and urls to load
*/
function createSpriteFileNames(name, height, numSprites, spritesPerFile) {
  return d3.range(Math.ceil(numSprites/spritesPerFile)).map(function(fileIndex) {
    var lowerEnd = fileIndex * spritesPerFile,
        upperEnd = (fileIndex + 1) * spritesPerFile >= numSprites ? numSprites - 1 : (fileIndex + 1) * spritesPerFile;
    return {
      name: `${name}_${lowerEnd}_${upperEnd}`, 
      url: `data/images/sprites/${name}_sprites_${height}_${lowerEnd}_${upperEnd}.png`
    };
  });
}


function loadCsv(url, callback) {
  d3.csv(url, parseNumbers, function(err, data) {
    callback(null, data);
  });
}

function parseNumbers(object, index, keys) {
  keys.forEach(function(key) {
    var val = parseFloat(object[key]);
    object[key] = isNaN(val) ? object[key] : val;
  });
  return object;
}

export default d3.rebind(loader, dispatch, 'on');