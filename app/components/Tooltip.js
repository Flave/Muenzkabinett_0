import * as d3 from 'd3';
import Template from 'app/templates/coinTooltip.template';
import templater from 'app/templater';

export default function Tooltip() {
  var template = templater(Template),
      root, rootEnter, rootUpdate,
      position = {x: 0, y: 0},
      data = {},
      visibility = false,
      width = 200;

  function tooltip(_data) {
    data = _data || data;
    rootUpdate = d3.select(document.body).selectAll('div.tooltip').data([1]);
    rootEnter = rootUpdate.enter().append('div')
      .classed('tooltip', true)
      .classed('coin-tooltip', true);


    root = rootUpdate.merge(rootEnter)
      .style('visibility', function() {return visibility ? 'visible' : 'hidden'})
      .style('width', width + 'px')
      .style('left', (position.x - width/2) + 'px')
      .style('bottom', (window.innerHeight - position.y + 20) + 'px')
      .html(function(){
        return template(data);
      });
    return tooltip;
  }

  tooltip.visibility = function(_) {
    if(!arguments.length) return visibility;
    visibility = _;
    return tooltip;
  }

  tooltip.position = function(_) {
    if(!arguments.length) return position;
    position = _;
    return tooltip;
  }


  return tooltip;
}