import * as d3 from 'd3';
import _findIndex from 'lodash.findindex';
import _find from 'lodash.find';

var layouter = {}

layouter.layouts = [
  {
    key: 'pile',
    value: 'Pile',
    requiredTypes: [],
    create: function pile(coins, size) {
      coins.forEach(function(coin, i) {
        var x = d3.randomNormal(size.width/2, 100)();
        var y = d3.randomNormal(size.height/2, 100)();
        coin.move(x, y);
      });
    }
  },
  {
    key: 'clusters',
    value: 'Clusters',
    requiredTypes: ['discrete'],
    create: function pile(coins, size) {
      coins.forEach(function(coin, i) {
        var x = d3.randomNormal(size.width/2, 100)();
        var y = d3.randomNormal(size.height/2, 100)();
        coin.move(x, y);
      });
    }
  },
  {
    key: 'cluster_list',
    value: 'Clusters List',
    requiredTypes: ['discrete'],
    create: function pile(coins, size) {
      coins.forEach(function(coin, i) {
        var x = d3.randomNormal(size.width/2, 100)();
        var y = d3.randomNormal(size.height/2, 100)();
        coin.move(x, y);
      });
    }
  },
  {
    key: 'scatter_line',
    value: 'Scatter Line',
    requiredTypes: ['continuous'],
    create: function plainGrid(coins) {
      var width = 3000;

      coins.sort(function(a, b) {
        return a.data.date_earliest - b.data.date_earliest;
      });
      var x = 0,
          yIndex = 0,
          y = 0;
      coins.forEach(function(coin, i) {
        if(x > width) {
          x = 0;
          yIndex++;
        }
        y = yIndex * 31;

        coin.move(x, y, 1000, Math.random() * 500);

        x += coin.width;
      });
    }
  },
  {
    key: 'plain_grid',
    value: 'Plain Grid',
    requiredTypes: ['continuous'],
    create: function plainGrid(coins) {
      var width = 3000;

      coins.sort(function(a, b) {
        return a.data.date_earliest - b.data.date_earliest;
      });
      var x = 0,
          yIndex = 0,
          y = 0;
      coins.forEach(function(coin, i) {
        if(x > width) {
          x = 0;
          yIndex++;
        }
        y = yIndex * 31;

        coin.move(x, y, 1000, Math.random() * 500);

        x += coin.width;
      });
    }
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

layouter.update = function(state, coins, size) {
  var layout = _find(layouter.layouts, {key: state.selectedLayout});
  if(!layout) console.log('no layout found');
  layout.create(coins, size);
}

layouter.getApplicableLayouts = function(state) {
  var applicableLayouts = [];

  layouter.layouts.forEach(function(layout) {
    var properties = state.selectedProperties,
        applicable = isLayoutApplicable(layout, properties);
    if(applicable) 
      applicableLayouts.push(layout);
  });
  return applicableLayouts;
}

export default layouter;