import * as d3 from 'd3';
import hogan from 'hogan.js';
import Template from 'app/templates/uiTaglist.template';
import stateStore from 'app/stores/state';
import _cloneDeep from 'lodash.clonedeep';
import _find from 'lodash.find';
import _findIndex from 'lodash.findindex';
import _remove from 'lodash.remove';
import templater from 'app/templater';

var tags = [
  {
    key: 'production_country',
    value: 'Country',
    type: 'discrete'
  },
  {
    key: 'production_region',
    value: 'Region',
    type: 'discrete'
  },
  {
    key: 'production_minting_place',
    value: 'Minting Place',
    type: 'discrete'
  },
  {
    key: 'weight',
    value: 'Weight',
    type: 'continuous'
  },
  {
    key: 'size',
    value: 'Size',
    type: 'continuous'
  },
  {
    key: 'date_earliest',
    value: 'Earliest Date',
    type: 'continuous'
  },
  {
    key: 'date_latest',
    value: 'Last Date',
    type: 'continuous'
  }
]

export default function UiTaglist() {
  var template = hogan.compile(Template),
      dispatch = d3.dispatch('click'),
      taglist,
      state,
      tag, tagEnter, tagUpdate;

  function uiTaglist(container) {
    state = stateStore.get();
    container.html(template.render({tags: stateStore.get().coinProperties}));
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
    var selectedProperties = _cloneDeep(stateStore.get().selectedProperties),
        removedProperty = _remove(selectedProperties, {key: d.key})
    if(removedProperty.length === 0)
      selectedProperties.push(d);
    stateStore.set('selectedProperties', selectedProperties);
  }

  uiTaglist.state = function(_) {
    if(!arguments.length) return size;
    size = _;
    return uiTaglist;
  }

  return d3.rebind(uiTaglist, dispatch, 'on');
}