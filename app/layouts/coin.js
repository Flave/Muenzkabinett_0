import * as d3 from 'd3';
import _find from 'lodash.find';
import Victor from 'victor';

export default {
  create: function plainGrid(coins, state, bounds, coinsBounds) {
    var width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top,
        centerX = bounds.left + width/2,
        centerY = bounds.top + height/2,
        selectedCoin = _find(coins, function(coin) {return coin.data.id === state.selectedCoin; })

    coins.forEach(function(coin, i) {
      if(coin.data.id === selectedCoin.data.id) {
        coin.move(centerX, centerY, 1000, Math.random() * 500);
        return;
      }
      var radiusScatter = Math.abs(d3.randomNormal(0, width/10)()) + 550 - d3.randomNormal(0, 20)(),
          delta = new Victor(coin.x - centerX, coin.y - centerY);
          delta.normalize().multiply(new Victor(radiusScatter, radiusScatter))
      coin.move(centerX + delta.x, centerY + delta.y, 1000, Math.random() * 500);
    });
  }
}