import * as d3 from 'd3';
window.d3 = d3;

var Component = function() {
  var data,
      size,
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      root, rootEnter

  function _component(container) {
  }

  _component.enter = function() {

  }

  _component.selector = function() {

  }

  _component.elementType = function() {

  }

  /*
  * Must be a component or a enter+update selection
  */
  _component.parent = function() {

  }

  return _component;
}

var root = Component()
  .selector('div.root')
  .parent()


var Timeline = function() {
  var data,
      timelineData,
      size,
      width = 130,
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      root, rootUpdate, rootEnter,
      yearMin, yearMax, totalDuration,
      year2X = d3.scaleLinear(),
      amount2Y = d3.scaleLinear(),
      timelineArea = d3.area()
        .x(function(year){ return year2X(year.year)})
        .y0(function(year){ return -amount2Y(year.numCoins)})
        .y1(0)
        .curve(d3.curveBasis),
      bins = d3.histogram().value(function(d) {
        return d.year;
      });

  function _timeline(container) {
    rootUpdate = container.selectAll('svg.timeline').data([1]);
    rootEnter = rootUpdate.enter().append('svg').attr("xmlns", "http://www.w3.org/2000/svg").classed('timeline', true);    

    root = rootUpdate.merge(rootEnter)
      .attr('width', width)
      .attr('height', size.height);
    updateScales()
    drawTimeline();
  }

  function updateScales() {
    year2X.domain([yearMin, yearMax]).range([0, size.height]);
    amount2Y.domain([0, d3.max(timelineData, function(d) {return d.numCoins})]).range([0, width]);
  }

  function calculateExtent() {
    totalDuration = yearMax - yearMin;

    yearMin = d3.min(data, function(coin) {return coin.dateEarliest;});
    yearMax = d3.max(data, function(coin) {return coin.dateLatest;});
  }

  function calculateTimelineData() {
    timelineData = d3.range(yearMin, yearMax + 1, 30).map(function(year) {
      var coinsPerYear = data.reduce(function(acc, coin) {
        if(coin.dateEarliest >= year-20 && coin.dateEarliest < year)
          return ++acc;
        return acc;
      }, 0);
      return {
        year: year,
        numCoins: coinsPerYear
      };
    });
  }

  function drawTimeline() {
    var group, groupEnter, groupUpdate,
        timeline, timelineEnter, timelineUpdate;

    groupUpdate = root.selectAll('g.timeline__area-container').data([1]);
    groupEnter = groupUpdate.enter().append('g').classed('timeline__area-container', true)
      .attr('transform', 'rotate(90)')
    group = groupUpdate.merge(groupEnter);

    timelineUpdate = group.selectAll('path.timeline__area').data([1])
    timelineEnter = timelineUpdate.enter().append('path').classed('timeline__area', true).datum(timelineData)
    timelineUpdate.merge(timelineEnter)
      .style('stroke', "#000")
      .style('fill', '#36e')
      .attr('d', timelineArea)
  }

  _timeline.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return _timeline;
  }

  _timeline.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    calculateExtent()
    calculateTimelineData();
    return _timeline;
  }

  return _timeline;
}

export default Timeline;