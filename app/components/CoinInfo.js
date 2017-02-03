import * as d3 from 'd3';
import Template from 'app/templates/coinInfo.template';
import templater from 'app/templater';
import {Point} from 'pixi.js';

var coinInfo = {},
    template = templater(Template),
    root, rootEnter, rootUpdate,
    position = {x: 0, y: 0},
    coin = {},
    visibility = false,
    width = 400;

rootUpdate = d3.select(document.body).selectAll('div.coin-info').data([1]);
rootEnter = rootUpdate.enter().append('div')
  .classed('coin-info', true);

root = rootUpdate.merge(rootEnter)
  .style('visibility', 'hidden');


// use apply if you have a canvas position and you want a pixel position
// use applyInverse if you have a pixel position and you want a canvas position
coinInfo.show = function(_data, transform) {
  coin = _data || coin;
  position = transform.localTransform.apply(new Point(coin.x, coin.y));

  root
    .style('visibility', function(){
      return transform.scale.x > 0.75 ? 'visible' : 'hidden';
    })
    .style('opacity', function() {
      if(transform.scale.x > 0.75)
        return transform.scale.x
      else
        return 0
    })
    .style('width', width + 'px')
    .style('left', (position.x - width/2 + coin.width/2) + 'px')
    .style('top', (position.y + coin.height + 20) + 'px')
    .style('transform', function() {
      return 'scale(' + transform.scale.x + ')';
    })
    .html(function(){
      return template(coin.data);
    });
  return coinInfo;
}

coinInfo.hide = function() {
  root.style('visibility', 'hidden')
  .style('opacity', 0);
  return coinInfo;
}

export default coinInfo;

/*
  coin = _data || coin;
  position = transform.localTransform.apply(new Point(coin.x, coin.y));

  root
    .style('visibility', 'visible')
    .style('opacity', 1)
    .style('width', width + 'px')
    .style('transform', function() {
      return `translate(${position.x}px, ${position.y}px)  scale(${transform.scale.x})`;
    })
    .html(function(){
      return template(coin.data);
    });
  return coinInfo;
*/