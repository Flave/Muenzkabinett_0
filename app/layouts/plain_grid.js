import * as d3 from 'd3';

export default {
  key: 'plain_grid',
  value: 'Plain Grid',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, state, bounds, coinsBounds) {
    var paddingRatio = 0.03,
        width = bounds.right - bounds.left,
        padding = width * paddingRatio,
        paddedBounds = {left: bounds.left + padding, right: bounds.right - padding*2, top: bounds.top + padding};

    coins.sort(function(a, b) {
      return a.data.date_earliest - b.data.date_earliest;
    });
    var x = paddedBounds.left,
        yIndex = 0,
        y = 0;
    coins.forEach(function(coin, i) {
      if(x > paddedBounds.right) {
        x = paddedBounds.left;
        yIndex++;
      }
      y = yIndex * 31 + paddedBounds.top;

      coin.move(x, y, 1000, Math.random() * 500);

      x += coin.width;
    });
  }
}