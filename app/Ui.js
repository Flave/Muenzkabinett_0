import coinsStore from 'app/stores/coins';
import * as d3 from 'd3';
import hogan from 'hogan.js';
import Template from 'app/templates/ui.template';
import stateStore from 'app/stores/state';
import _template from 'app/templater';

import UiTabs from 'app/components/UiTabs';
import UiTaglist from 'app/components/UiTaglist';
import UiLayoutSelection from 'app/components/UiLayoutSelection';

export default function Ui() {
  var root, rootEnter, rootUpdate,
      container,
      template = _template(Template),
      uiTabs = UiTabs(),
      uiTaglist = UiTaglist(),
      uiLayoutSelection = UiLayoutSelection(),
      dispatch = d3.dispatch('click'),
      visible = true;

  stateStore.on('change.ui', render);

  function ui(_container) {
    container = _container;
    render();
    return ui;
  }

  function render() {
    var state = stateStore.get(),
        toggleText = visible ? 'Hide' : 'Show',
        toggleClass = visible ? 'is-visible' : '';
    container.html(template({toggle: toggleText}))
    uiTabs(container.select('#tabs'));
    uiTaglist(container.select('#attributes'));
    uiLayoutSelection(container.select('#layouts'));

    container
      .classed('is-visible', visible)

    container.selectAll('.ui__toggle').on('click', function() {
      visible = !visible;
      render();
    })
  }



  ui.state = function(_) {
    if(!arguments.length) return size;
    size = _;
    return ui;
  }

  return d3.rebind(ui, dispatch, 'on');
}