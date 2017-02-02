import * as d3 from 'd3';
import templater from 'app/templater';
import Template from 'app/templates/uiTabs.template';
import stateStore from 'app/stores/state';

var tabs = [
  {
    key: 'coins',
    value: 'Coins'
  },
  {
    key: 'people',
    value: 'People'
  }
]

export default function UiTabs() {
  var template = templater(Template),
      dispatch = d3.dispatch('click');

  function uiTabs(container) {
    container.html(template({tabs: tabs}));
    container
      .selectAll('.ui-tabs__tab')
      .classed('is-selected', function(d, i) {
        if(i===0) return true;
      })
      .on('click', onTabClick);

    return uiTabs;
  }

  function onTabClick(d, i) {
    //stateStore.set('selectedTab', tabs[i].key);
  }


  uiTabs.state = function(_) {
    if(!arguments.length) return size;
    size = _;
    return uiTabs;
  }

  return d3.rebind(uiTabs, dispatch, 'on');
}