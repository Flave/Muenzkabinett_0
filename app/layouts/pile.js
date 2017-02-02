import * as d3 from 'd3';

export default {
  key: 'pile',
  value: 'Pile',
  requiredTypes: [],
  create: function pile(coins, state, bounds) {
    var width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top;
    coins.forEach(function(coin, i) {
      var x = d3.randomNormal(bounds.left + width/2, width/10)();
      var y = d3.randomNormal(bounds.top + height/2, height/10)();
      coin.move(x, y);
    });
  }
}