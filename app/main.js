import app from './App';
import * as PIXI from 'pixi.js';

require("./index.html");
require("./sass/main.scss");

//Create the renderer
var renderer = PIXI.autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

function setup() {
  var sprite = new PIXI.Sprite(
    PIXI.loader.resources["data/images/thumbs_front/thumb_front_18200001.jpg"].texture
  );
  stage.addChild(sprite);
  renderer.render(stage);
}

// "http://s3.eu-central-1.amazonaws.com/muenzkabinett/thumb_front_18200001.jpg"

PIXI.loader
  .add("data/images/thumbs_front/thumb_front_18200001.jpg")
  .load(setup);