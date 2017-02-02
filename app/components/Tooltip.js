import * as d3 from 'd3';
import Template from 'app/templates/coinTooltip.template';
import templater from 'app/templater';

var tooltip = {},
    template = templater(Template),
    root, rootEnter, rootUpdate,
    position = {x: 0, y: 0},
    data = {},
    visibility = false,
    width = 200;

rootUpdate = d3.select(document.body).selectAll('div.tooltip').data([1]);
rootEnter = rootUpdate.enter().append('div')
  .classed('tooltip', true)
  .classed('coin-tooltip', true);
root = rootUpdate.merge(rootEnter)
  .style('visibility', 'hidden');

tooltip.show = function(_data, position) {
  data = _data || data;
  rootUpdate = d3.select(document.body).selectAll('div.tooltip').data([1]);


  root
    .style('visibility', 'visible')
    .style('width', width + 'px')
    .style('left', (position.x - width/2) + 'px')
    .style('bottom', (window.innerHeight - position.y + 15) + 'px')
    .html(function(){
      return template(data);
    });
  return tooltip;
}

tooltip.hide = function() {
  root.style('visibility', 'hidden');
  return tooltip;
}

document.addEventListener('mousemove', function() {
  tooltip.hide();
});

export default tooltip;