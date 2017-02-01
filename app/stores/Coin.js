import {Sprite, Point} from 'pixi.js';
import * as d3 from 'd3';
import Tooltip from 'app/components/Tooltip';

export default function Coin(texture, data) {
  var coin = new PIXI.Sprite(texture),
      dispatch = d3.dispatch('dragstart', 'drag', 'dragend'),
      tooltip = Tooltip();
  coin.data = data;
  //coin.visible = false;

  coin
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

  function onMouseOver(event) {
    var coinCenter = new Point(coin.position.x + coin.width/2, coin.position.y),
        projectedPoint = this.parent.transform.localTransform.apply(coinCenter);

    window.setTimeout(function() {
      tooltip
        .visibility(true)
        .position(projectedPoint)(coin.data);
    });
  }

  function onMouseOut(event) {
    tooltip.visibility(false)();
  }

  function onDragStart(event) {
    this.event = event.data;
    this.dragging = true;

    var transform = this.parent.transform.localTransform;
    var pos = new Point(this.position.x, this.position.y)
    var posProjected = transform.apply(pos);

    var offsetX = event.data.originalEvent.clientX - posProjected.x,
        offsetY = event.data.originalEvent.clientY - posProjected.y;

    this.event.eventOffset = {x: offsetX, y: offsetY};
    dispatch.call('dragstart');
  }

  function onDragMove() {
    if (this.dragging) {
      var mouseX = this.event.originalEvent.clientX,
          mouseY = this.event.originalEvent.clientY,
          offsetX = this.event.eventOffset.x,
          offsetY = this.event.eventOffset.y,
          // parent is the PIXI container object the coin is contained in
          transform = this.parent.transform.localTransform,
          originalPoint = new Point(mouseX - offsetX, mouseY - offsetY),
          projectedPoint = transform.applyInverse(originalPoint);
      this.position.x = projectedPoint.x;
      this.position.y = projectedPoint.y;
      dispatch.call('drag');
    }
  }

  function onDragEnd() {
    this.dragging = false;
    // set the interaction data to null
    this.event = null;
    dispatch.call('dragend');
  }

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