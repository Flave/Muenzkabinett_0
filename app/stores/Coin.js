import {Sprite, Point} from 'pixi.js';
import * as d3 from 'd3';

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
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.event = event.data;
    this.dragging = true;
    var scale = this.parent.transform.scale._x,
        transform = this.parent.transform.localTransform,
        offset = transform.apply(new Point(event.data.originalEvent.clientX - this.position.x, event.data.originalEvent.clientY - this.position.y));

    var offsetX = offset.x;
    var offsetY = offset.y;
    this.event.eventOffset = {x: offsetX, y: offsetY};
    dispatch.call('dragstart');
  }

  function onDragMove() {
    if (this.dragging) {
      var mouseX = this.event.originalEvent.clientX,
          mouseY = this.event.originalEvent.clientY,
          scale = this.parent.transform.scale._x,
          position = this.parent.transform.position,
          transform = this.parent.transform.localTransform,
          projectedMouse = transform.applyInverse(new Point(mouseX, mouseY));
      this.position.x = projectedMouse.x;// - this.event.eventOffset.x;
      this.position.y = projectedMouse.y;// - this.event.eventOffset.y;
      dispatch.call('drag');
    }
  }

  function onDragEnd() {
    this.dragging = false;
    // set the interaction data to null
    this.event = null;
    dispatch.call('dragend');
  }
  return d3.rebind(coin, dispatch, 'on');
}