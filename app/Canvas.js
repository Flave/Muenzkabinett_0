import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import coinsStore from 'app/stores/coins';
import * as d3 from 'd3';
import stateStore from 'app/stores/state';

export default function Canvas() {
  var renderer,
      stage,
      zoomCanvas,
      size = {width: 200, height: 200},
      zoomBehavior = d3.zoom().scaleExtent([0.1, 1.2]).on("zoom", zoom),
      pos2Tint = d3.scaleQuantize().domain([-2, 2]).range([0x999999, 0xaaaaaa, 0xbbbbbb, 0xffffff])

  function canvas(container) {
    renderer = autoDetectRenderer(size.width, size.height, {transparent: true});
    container.appendChild(renderer.view);
    stage = new Container();
    stage.interactiveChildren = true;
    stage.cacheAsBitmap = false;
    zoomCanvas = d3.select(renderer.view)
      .call(zoomBehavior);
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
    return true;
  }

  function updateLayout() {
    var coins = coinsStore.get(),
        width = 3000;

    console.log('updating layout');

    coins.sort(function(a, b) {
      return a.data.date_earliest - b.data.date_earliest;
    });
    var x = 0,
        yIndex = 0,
        y = 0;
    coins.forEach(function(coin, i) {
      if(x > width) {
        x = 0;
        yIndex++;
      }
      y = yIndex * 31;

      coin.move(x, y, 1000, Math.random() * 500);

      x += coin.width;
    });
  }

  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return canvas;
}