//Create the renderer
var renderer = PIXI.autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.getElementById("app-container").appendChild(renderer.view);

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
  sprite.texture = PIXI.utils.TextureCache["data/images/thumbs_front/thumb_front_18200002.jpg"]
}

// "http://s3.eu-central-1.amazonaws.com/muenzkabinett/thumb_front_18200001.jpg"

PIXI.loader
  .add("data/images/thumbs_front/thumb_front_18200001.jpg")
  .add("data/images/thumbs_front/thumb_front_18200002.jpg")
  .load(setup);