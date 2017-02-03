import * as d3 from 'd3';
import Template from 'app/templates/uiTaglist.template';
import stateStore from 'app/stores/state';
import _cloneDeep from 'lodash.clonedeep';
import _find from 'lodash.find';
import _remove from 'lodash.remove';
import templater from 'app/templater';
import constants from 'app/constants';


var tags = constants.coinProperties.filter(function(property) {return property.type !== 'individual'});

export default function UiTaglist() {
  var template = templater(Template),
      dispatch = d3.dispatch('click'),
      taglist,
      state,
      tag, tagEnter, tagUpdate;

  function uiTaglist(container) {
    state = stateStore.get();
    container.html(template());
    taglist = container.select('#taglist');

    tagUpdate = taglist.selectAll('span.ui-taglist__tag').data(tags);
    tagEnter = tagUpdate.enter().append('span').classed('ui-taglist__tag', true);
    tag = tagEnter.merge(tagUpdate);
    tag
      .text(function(d, i) {return d.value;})
      .on('click', onTagClick)
      .classed('is-selected', function(d) {
        var selected = _find(state.selectedProperties, {key: d.key});
        return selected !== undefined;
      })
    tag.exit().remove();

    return uiTaglist;
  }

  function onTagClick(d, i) {
    var state = _cloneDeep(stateStore.get()),
        selectedProperties = state.selectedProperties,
        // remove the selected property if it was already selected
        removedProperty = _remove(selectedProperties, {key: d.key})
        
    // only add property if there was no property removed
    if(removedProperty.length === 0)
      selectedProperties.push(d);

    // deselect coin if selected
    if(state.selectedCoin !== undefined)
      stateStore.set('selectedCoin', undefined, false);

    stateStore.set('selectedProperties', selectedProperties);
  }

  uiTaglist.state = function(_) {
    if(!arguments.length) return size;
    size = _;
    return uiTaglist;
  }

  return d3.rebind(uiTaglist, dispatch, 'on');
}