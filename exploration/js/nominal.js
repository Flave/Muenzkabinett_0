function DurationTimelines() {
  var data,
      currencies = [],
      root,
      svg,
      svgEnter,
      g,
      gEnter,
      rowHeight = 10,
      width = 1200,
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      extent = [],
      extentDiff,
      yearToX = d3.scaleLinear().range([0, width]);

  function _durationTimelines(_root) {
    root = _root;
    mergeCurrencies();
    height = rowHeight * currencies.length;
    console.log(currencies);
    extent[0] = _.minBy(currencies, function(currency) {return currency.date_earliest}).date_earliest;
    extent[1] = _.maxBy(currencies, function(currency) {return currency.date_latest}).date_latest;
    extentDiff = extent[1] - extent[0];
    yearToX.domain(extent);

    svg = root
      .selectAll("svg")
      .data([1]);

    svgEnter = svg.enter().append("svg").attr('height', height).attr('width', width);
    g = svg.merge(svgEnter).selectAll("g").data([1])
    gEnter = g.enter().append("g");
    drawTimelines();
  }

  function drawTimelines() {
    var line, lineEnter;

    line = g.merge(gEnter).selectAll('line').data(currencies);
    lineEnter = line.enter().append('line')
      .attr('x1', function(currency) {
        return yearToX(currency.date_earliest)
      })
      .attr('x2', function(currency) {
        return yearToX(currency.date_latest)
      })
      .attr('y1', function(currency, i) {
        return rowHeight * i
      })
      .attr('y2', function(currency, i) {
        return rowHeight * i
      })
      .style('stroke', '#000')
      .each(function(c) {console.log(c.duration)})

    var label, labelEnter;

    label = g.merge(gEnter).selectAll('text').data(currencies);
    labelEnter = label.enter().append('text')
      .text(function(currency) {
        return currency.name
      })
      .attr('transform', function(currency, i) {
        return "translate(0,"+ (rowHeight * i) + ")";
      });
  }

  function mergeCurrencies() {
    _.each(data, function(coin) {
      var currency = _.find(currencies, {name: coin.currency});
      if(currency) {
        if(coin.date_earliest < currency.date_earliest) {
          currency.date_earliest = coin.date_earliest
        }
        if(coin.date_latest > currency.date_latest) {
          currency.date_latest = coin.date_earliest
        }
      }
      if(!currency) {
        currency = {
          name: coin.currency, 
          date_earliest: coin.date_earliest,
          date_latest: coin.date_latest
        };
        currencies.push(currency);
      }
    });

    _.each(currencies, function(currency) {currency.duration = currency.date_latest - currency.date_earliest})

    currencies = _.sortBy(currencies, function(c) {return -c.duration})
  }

  _durationTimelines.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _durationTimelines;
  }

  return _durationTimelines;
}

function expandData(compressed) {
  var raw = compressed.slice(1, compressed.length),
      keys = compressed[0],
      data = _.map(raw, function(d) {
        return _.zipObject(keys, d);
      });
  return data;
}

function convertNumbers(row) {
  var r = {};
  for (var k in row) {
    r[k] = +row[k];
    if (isNaN(r[k])) {
      r[k] = row[k];
    }
  }
  return r;
}

// APP

function app() {
  var _app = {},
      data = {},
      durationTimelines = DurationTimelines()
      files = ["coins_nominal"];

  function loadData() {
    _.map(files, function(file) {
      d3.csv("../data/csv/"+ file +".csv", convertNumbers, function(err, response) {
        if(!err)
          data = response;
        render();
      });
    });
  }

  function render() {
    durationTimelines.data(data)
    d3.select("#root").call(durationTimelines);
  }

  _app.run = function() {
    loadData();
  }
  return _app;
}

window.onload = function() {
  app().run();
}