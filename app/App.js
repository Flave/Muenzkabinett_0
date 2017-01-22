//import loader from './loader';
//import Timeline from './Timeline';
import * as d3 from 'd3';
import {loader, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';

console.log(loader);

var app = {},
    data,
    size = {},
    renderer,
    stage;

app.init = function() {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  renderer = autoDetectRenderer(256, 256, {transparent: true});
  document.body.appendChild(renderer.view);
  stage = new Container();
  renderer.render(stage);

  load();
}

function load() {
  d3.csv("data/csv/coins_sprites_specs.csv", function(err, spriteSpecs) {
    var spec = spriteSpecs[0];
    loader
      .add("data/images/coins_sprites.png")
      .load(function() {
        var texture = loader.resources["data/images/coins_sprites.png"].texture;
        var rectangle = new Rectangle(spec.x, spec.y, spec.width, spec.height);
        texture.frame = rectangle;

        var sprite = new PIXI.Sprite(texture);
        sprite.x = 30;
        stage.addChild(sprite);
        renderer.render(stage);
      })
  });
}

/*
function setSize() {
  render();
}

function render(data) {
  var container = d3.select('#app-container');
}

window.addEventListener('resize', function() {
  
});
*/
export default app;