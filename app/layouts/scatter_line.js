import * as d3 from 'd3';

var cache = {};

function groupCoins(coins, step) {
  if(cache.date_earliest) return cache.date_earliest;
  var extent = d3.extent(coins, function(c, i) { return c.data.date_earliest;}),
      bins = d3.range(Math.floor(extent[0]), Math.ceil(extent[1]), step),
      groups = bins.map(function(stepIndex) {
      var coinsInStep = [];
      coins.forEach(function(coin) {
        var floored = Math.floor(coin.data.date_earliest)
        if(floored >= stepIndex && floored <= (stepIndex + step))
          coinsInStep.push(coin);
      });
    return coinsInStep;
  });
  cache.date_earliest = groups;
  return groups;
}

export default {
  key: 'scatter_line',
  value: 'Scatter Line',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, state, bounds, coinsBounds) {
    var groups = groupCoins(coins, 100),
        paddingRatio = 0.03,
        width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top,
        padding = width * paddingRatio,
        paddedBounds = {left: bounds.left + padding, right: bounds.right - padding*2, top: bounds.top + padding},
        paddedWidth = paddedBounds.right - paddedBounds.left,
        centerX = bounds.left + width/2,
        centerY = bounds.top + height/2,
        spacingX = paddedWidth / groups.length,
        maxGroupLength = d3.max(groups, function(group) {return group.length}),
        maxSpreadY = height,
        spreadX = spacingX/2;

    console.log(maxGroupLength, maxSpreadY);
    groups.forEach(function(group, groupIndex) {
      if(groupIndex > 100) return;
      group.forEach(function(coin, coinIndex) {
        var spreadY = (maxSpreadY/maxGroupLength) * group.length * 0.05,
            xOffset = groupIndex * spacingX - d3.randomNormal(coin.width/2, spreadX)() - 5,
            x = paddedBounds.left + xOffset,
            y = centerY + d3.randomNormal(0, spreadY)();

        coin.move(x, y, 1000, Math.random() * 500);
      });
    });
  }
}