import * as d3 from 'd3';
import Template from 'app/templates/uiLayoutSelection.template';
import stateStore from 'app/stores/state';
import templater from 'app/templater';
import layouts from 'app/layouts';
import layouter from 'app/layouter';
import _find from 'lodash.find';

export default function UiLayoutSelection() {
  var template = templater(Template),
      dispatch = d3.dispatch('click'),
      layout, layoutEnter, layoutUpdate;

  function uiLayoutSelection(container) {
    var state = stateStore.get(),
        layoutList,
        applicableLayouts = layouter.getApplicableLayouts(state);

    container.html(template());
    layoutList = container.select('#layouts-list');

    layoutUpdate = layoutList.selectAll('span.ui-layouts-list__layout').data(layouts);
    layoutEnter = layoutUpdate.enter().append('span').classed('ui-layouts-list__layout', true);
    layout = layoutEnter.merge(layoutUpdate);
    layout
      .on('click', function(d, i) {
        var layout = layouts[i],
            applicableLayout = _find(applicableLayouts, {key: layout.key});
        if(applicableLayout)
          onLayoutClick(i);
      })
      .attr('class', function(d, i) {
        var layout = layouts[i],
            applicableLayout = _find(applicableLayouts, {key: layout.key}),
            disabled = applicableLayout ? '' : 'is-disabled';
        return 'ui-layouts-list__layout icon icon-' + layout.key + '  ' + disabled;
      })
      .classed('is-selected', function(d, i) {
        return state.selectedLayout === layouts[i].key;
      });

    layout.exit().remove();

    return uiLayoutSelection;
  }

  function onLayoutClick(i) {
    stateStore.set('selectedLayout', layouts[i].key);
  }

  uiLayoutSelection.state = function(_) {
    if(!arguments.length) return size;
    size = _;
    return uiLayoutSelection;
  }

  return d3.rebind(uiLayoutSelection, dispatch, 'on');
}