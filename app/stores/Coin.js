import {Sprite, Point} from 'pixi.js';
import * as d3 from 'd3';
import tooltip from 'app/components/Tooltip';
import stateStore from 'app/stores/state';

export default function Coin(texture, data) {
  var coin = new PIXI.Sprite(texture),
      dispatch = d3.dispatch('dragstart', 'drag', 'dragend', 'click');
  coin.data = data;
  coin.interactive = true;
  //coin.visible = false;

  coin
    .on('click', onClick)
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove)
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut);


  function onClick(event) {
    if(this.moved)
      return;
    dispatch.call('click', coin);
  }

  function onMouseOver(event) {
    var coinCenter = new Point(coin.position.x + coin.width/2, coin.position.y),
        projectedPoint = this.parent.transform.localTransform.apply(coinCenter),
        state = stateStore.get(),
        tooltipData = {
          title: coin.data.title,
          date_earliest: coin.data.date_earliest,
          date_latest: coin.data.date_latest,
          selectedProperty: state.selectedProperties.length && coin.data[state.selectedProperties[0].key]
        }

    window.setTimeout(function() {
      tooltip.show(tooltipData, projectedPoint);
    });
    this.overCoin = true;
  }

  function onMouseOut(event) {
    tooltip.hide();
    this.overCoin = false;
  }

  function onDragStart(event) {
    this.event = event.data;
    this.dragging = true;
    this.moved = null;

    var transform = this.parent.transform.localTransform;
    var pos = new Point(this.position.x, this.position.y)
    var posProjected = transform.apply(pos);

    var offsetX = event.data.originalEvent.clientX - posProjected.x,
        offsetY = event.data.originalEvent.clientY - posProjected.y;

    this.event.eventOffset = {x: offsetX, y: offsetY};
    dispatch.call('dragstart');
  }

  function onDragMove(event) {
    if (this.dragging) {
      var mouseX = this.event.originalEvent.clientX,
          mouseY = this.event.originalEvent.clientY,
          offsetX = this.event.eventOffset.x,
          offsetY = this.event.eventOffset.y,
          // parent is the PIXI container object the coin is contained in
          transform = this.parent.transform.localTransform,
          originalPoint = new Point(mouseX - offsetX, mouseY - offsetY),
          projectedPoint = transform.applyInverse(originalPoint);
      // to check insie clickhandler whether coin has been moved
      this.moved = true;
      this.position.x = projectedPoint.x;
      this.position.y = projectedPoint.y;
      dispatch.call('drag');
    }

    if(this.overCoin)
      event.data.originalEvent.stopPropagation();
  }

  function onDragEnd() {
    // set the interaction data to null
    this.dragging = false;
    this.event = null;
    dispatch.call('dragend');
  }

  /*
    var x = properties.x !== undefined ? properties.x : coin.position.x,
        y = properties.y !== undefined ? properties.y : coin.position.y,
        scale = properties.scale !== undefined ? properties.scale : coin.scale,
        dx = x - coin.position.x,
        dy = y - coin.position.y,
        ds = scale - coin.scale,
        ox = coin.position.x,
        oy = coin.position.y,
        os = coin.scale;
  */

  coin.move = function(x, y, duration, delay, cb) {
    var dx = x - coin.position.x,
        dy = y - coin.position.y,
        ox = coin.position.x,
        oy = coin.position.y;

    delay = delay || 0;
    duration = duration || 1000;

    var timer = d3.timer(function(elapsed) {
      var t = elapsed / duration;
      coin.position.x =  ox + (dx * d3.easePolyInOut(t, 3));
      coin.position.y =  oy + (dy * d3.easePolyInOut(t, 3));
      if(elapsed > duration) {
        timer.stop();
        cb !== undefined && cb(coin);
      }
    }, delay);
  }

  return d3.rebind(coin, dispatch, 'on');
}