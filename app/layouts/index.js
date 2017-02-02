import pile from './pile';
import plain_grid from './plain_grid';
import scatter_line from './scatter_line';
import scatter_plot from './scatter_plot';
import clusters from './clusters';

export default [
  pile,
  plain_grid,
  scatter_line,
  scatter_plot, 
  clusters,
  {
    key: 'cluster_list',
    value: 'Clusters List',
    requiredTypes: ['discrete'],
    create: function pile(coins, size) {
      coins.forEach(function(coin, i) {
        var x = d3.randomNormal(size.width/2, 100)();
        var y = d3.randomNormal(size.height/2, 100)();
        coin.move({x:x, y:y});
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
    key: 'nested_grid',
    value: 'Nested Grid',
    requiredTypes: ['discrete', 'continuous']
  }
]