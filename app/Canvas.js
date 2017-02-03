import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import coinsStore from 'app/stores/coins';
import * as d3 from 'd3';
import stateStore from 'app/stores/state';
import layouter from 'app/layouter';
import coinInfo from 'app/components/CoinInfo';
import _find from 'lodash.find';

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
      coin
      .on('dragstart', function() {
        zoomCanvas.on('.zoom', null);
      })
      .on('dragend', function() {
        zoomCanvas.call(zoomBehavior);
      })
      .on('click', function() {
        var state = stateStore.get();
        coinInfo.hide();
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
    updateCoinInfo();
  }

  function zoomEnd() {

  }

  function update() {
    var state = stateStore.get(),
        prevState = stateStore.getPrevious(),
        bounds = getCanvasBounds(),
        coins = coinsStore.get();

    layouter.update(coins, state, bounds);
    window.setTimeout(function() {
      updateCoinInfo();
    }, 1200);
  }

  function updateCoinInfo() {
    var state = stateStore.get(),
        coins = coinsStore.get();

    if(state.selectedCoin !== undefined) {
      var coin = _find(coins, function(coin) {return coin.data.id === state.selectedCoin});
      coinInfo.show(coin, stage.transform);
    } else {
      coinInfo.hide();
    }
  }


  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return canvas;
}