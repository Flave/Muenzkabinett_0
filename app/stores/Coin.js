import {Sprite, Point} from 'pixi.js';
import * as d3 from 'd3';
import TweenLite from 'gsap';

export default function Coin(texture, data) {
  var coin = new PIXI.Sprite(texture),
      dispatch = d3.dispatch('dragstart', 'drag', 'dragend');
  coin.data = data;

  coin
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove);

  function onDragStart(event) {
    // "this" is the coin object (a PIXI Sprite object)
/*    this.event = event.data;
    this.dragging = true;
    var offsetX = event.data.originalEvent.clientX - this.position.x,
        offsetY = event.data.originalEvent.clientY - this.position.y;
    this.event.eventOffset = {x: offsetX, y: offsetY};
    dispatch.call('dragstart');*/

    // "this" is the coin object (a PIXI Sprite object)
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

  coin.move = function(x, y, delay) {
    TweenLite.to(coin, 1, {x: x, y: y, delay: delay/2});
  }

  return d3.rebind(coin, dispatch, 'on');
}