import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import coinsStore from 'app/stores/coins';
import * as d3 from 'd3';
import stateStore from 'app/stores/state';
import layouter from 'app/layouter';

export default function Canvas() {
  var renderer,
      stage,
      zoomCanvas,
      size = {width: 200, height: 200},
      zoomBehavior = d3.zoom().scaleExtent([0.1, 1.2]).on("zoom", zoom).on('end', zoomEnd);

  function canvas(container) {
    renderer = autoDetectRenderer(size.width, size.height, {transparent: true});
    container.appendChild(renderer.view);
    stage = new Container();
    stage.interactiveChildren = true;
    zoomCanvas = d3.select(renderer.view).call(zoomBehavior);
    renderer.render(stage);
  }

  canvas.init = function() {
    coinsStore.get().forEach(function(coin, i) {
      coin.x = d3.randomNormal(size.width/2, 100)();
      coin.y = d3.randomNormal(size.height/2, 100)();
      coin.interactive = true;

      coin
      .on('dragstart', function() {
        zoomCanvas.on('.zoom', null);
      })
      .on('dragend', function() {
        zoomCanvas.call(zoomBehavior);
      });

      stage.addChild(coin);
    });

    stateStore.on('change.canvas', updateLayout);

    requestAnimationFrame( animate );
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
  }

  function zoom() {
    stage.setTransform(d3.event.transform.x, d3.event.transform.y, d3.event.transform.k, d3.event.transform.k);
    renderer.render(stage);
  }

  function zoomEnd() {

  }

  function updateLayout() {
    var state = stateStore.get();
    layouter.update(state, coinsStore.get(), size)
  }

  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return canvas;
}