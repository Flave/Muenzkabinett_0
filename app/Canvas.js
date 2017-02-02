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

  function getCanvasBounds() {
    var topLeft = projectPixel(0, 0),
        bottomRight = projectPixel(window.innerWidth, window.innerHeight);
    return {
      left: topLeft.x,
      top: topLeft.y,
      right: bottomRight.x,
      bottom: bottomRight.y
    }
  }

  function projectPixel(x, y) {
    var mousePos = new Point(x, y);
    return stage.transform.localTransform.applyInverse(mousePos);
  }

  canvas.init = function() {
    coinsStore.get().forEach(function(coin, i) {
/*      coin.x = d3.randomNormal(size.width/2, 100)();
      coin.y = d3.randomNormal(size.height/2, 100)();

      coin.move(coin.x, coin.y, 500, Math.random() * 100);*/

      coin
      .on('dragstart', function() {
        zoomCanvas.on('.zoom', null);
      })
      .on('dragend', function() {
        zoomCanvas.call(zoomBehavior);
      })
      .on('click', function() {
        var state = stateStore.get();
        if(state.selectedCoin === this.data.id)
          stateStore.set('selectedCoin', undefined);
        else
          stateStore.set('selectedCoin', this.data.id);
      });

      stage.addChild(coin);
    });

    stateStore.on('change.canvas', update);

    requestAnimationFrame( animate );
    update();
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

  function update() {
    var state = stateStore.get(),
        prevState = stateStore.getPrevious(),
        bounds = getCanvasBounds();
    layouter.update(coinsStore.get(), state, bounds);    
  }


  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return canvas;
}