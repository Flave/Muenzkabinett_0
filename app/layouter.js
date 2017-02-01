import coinsStore from 'app/stores/coins';
import stateStore from 'app/stores/state';
import * as d3 from 'd3';
import _findIndex from 'lodash.findindex';

var layouter = {}

layouter.layouts = [
  {
    key: 'pile',
    value: 'Pile',
    requiredTypes: []
  },
  {
    key: 'clusters',
    value: 'Clusters',
    requiredTypes: ['discrete']
  },
  {
    key: 'cluster_list',
    value: 'Clusters List',
    requiredTypes: ['discrete']
  },
  {
    key: 'scatter_line',
    value: 'Scatter Line',
    requiredTypes: ['continuous']
  },
  {
    key: 'plain_grid',
    value: 'Plain Grid',
    requiredTypes: ['continuous']
  },
  {
    key: 'cluster_grid',
    value: 'Clusters Grid',
    requiredTypes: ['discrete', 'discrete']
  },
  {
    key: 'scatter_lines',
    value: 'Scatter Lines',
    requiredTypes: ['discrete', 'continuous']
  },
  {
    key: 'scatter_plot',
    value: 'Scatter Plot',
    requiredTypes: ['continuous', 'continuous']
  },
  {
    key: 'nested_grid',
    value: 'Nested Grid',
    requiredTypes: ['discrete', 'continuous']
  }
]

function isLayoutApplicable(layout, properties) {
  var applicable = false,
      requiredTypes = layout.requiredTypes,
      propertiesCheck = requiredTypes.slice();

  if(layout.requiredTypes.length !== properties.length)
    return false;

  if(properties.length === 0) return true;

  for(var i = 0; i < propertiesCheck.length; i++) {
    // check if property
    var index = propertiesCheck.indexOf(properties[i].type)
    if(index === -1)
      break;
    propertiesCheck[index] = undefined;
    if(i === properties.length-1)
      applicable = true;
  }

  return applicable;
}


layouter.getApplicableLayouts = function() {
  var state = stateStore.get(),
      applicableLayouts = [];

  layouter.layouts.forEach(function(layout) {
    var properties = state.selectedProperties,
        applicable = isLayoutApplicable(layout, properties);
    if(applicable) 
      applicableLayouts.push(layout);
  });
  return applicableLayouts;
}

export default layouter;