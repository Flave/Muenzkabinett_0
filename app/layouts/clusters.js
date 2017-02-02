export default {
  key: 'clusters',
  value: 'Clusters',
  requiredTypes: ['discrete'],
  create: function pile(coins, size) {
    coins.forEach(function(coin, i) {
      var x = d3.randomNormal(size.width/2, 100)();
      var y = d3.randomNormal(size.height/2, 100)();
      coin.move({x:x, y:y});
    });
  }
}