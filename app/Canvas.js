import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import coinsStore from 'app/stores/coins';
import * as d3 from 'd3';

export default function Canvas() {
  var renderer,
      stage,
      zoomCanvas,
      size = {width: 200, height: 200},
      zoomBehavior = d3.zoom().scaleExtent([0.3, 1.2]).on("zoom", zoom),
      pos2Tint = d3.scaleQuantize().domain([-2, 2]).range([0x999999, 0xaaaaaa, 0xbbbbbb, 0xffffff])

  function canvas() {
    renderer = autoDetectRenderer(size.width, size.height, {transparent: true});
    document.body.appendChild(renderer.view);
    stage = new Container();
    zoomCanvas = d3.select(renderer.view)
      .call(zoomBehavior);
    renderer.render(stage);
    //renderer.plugins.interaction.moveWhenInside = true;
  }

  canvas.render = function() {
    coinsStore.get().forEach(function(coin, i) {
      //if(i > 1) return;
      coin.x = d3.randomNormal(size.width/2, 100)();
      coin.y = d3.randomNormal(size.height/2, 100)();
      coin.interactive = true;
      //coin.tint = pos2Tint(coin.x/size.width + coin.y/size.height);
      if(i < 100)
        console.log();

      coin
      .on('dragstart', function() {
        zoomCanvas.on('.zoom', null);
      })
      .on('dragend', function() {
        zoomCanvas.call(zoomBehavior);
      });

      stage.addChild(coin);
    })
    renderer.render(stage);
  }

  requestAnimationFrame( animate );

  function animate() {

      requestAnimationFrame(animate);

      // render the stage
      renderer.render(stage);
  }

  function zoom() {
    stage.setTransform(d3.event.transform.x, d3.event.transform.y, d3.event.transform.k, d3.event.transform.k);
    renderer.render(stage);
    return true;
  }


  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return canvas;
}