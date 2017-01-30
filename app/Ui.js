import coinsStore from 'app/stores/coins';
import * as d3 from 'd3';
import hogan from 'hogan.js';
import Template from 'app/templates/ui.template';
import stateStore from 'app/stores/state';

import UiTabs from 'app/components/UiTabs';
import UiTaglist from 'app/components/UiTaglist';

export default function Ui() {
  var root, rootEnter, rootUpdate,
      template = hogan.compile(Template),
      uiTabs = UiTabs(),
      uiTaglist = UiTaglist(),
      dispatch = d3.dispatch('click');

  function ui(container) {
    var state = stateStore.get();
    container.html(template.render(state));
    uiTabs(container.select('#tabs'));
    uiTaglist(container.select('#attributes'));
    return ui;
  }



  ui.state = function(_) {
    if(!arguments.length) return size;
    size = _;
    return ui;
  }

  return d3.rebind(ui, dispatch, 'on');
}