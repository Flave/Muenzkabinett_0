function Timeline() {
  var data,
      root,
      svg,
      svgEnter,
      g,
      gEnter,
      circleGroup,
      circleGroupEnter,
      coin,
      coinEnter,
      actor,
      actorEnter,
      width = 1200,
      height = 500,
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      year2X = d3.scaleLinear(),
      xAxis = d3.axisTop(year2X),
      coinYearExtent = [],
      actorYearExtent = [],
      yearExtent = [];

  function _timeline(_root) {
    root = _root;
    svg = root
      .selectAll("svg")
      .data([1]);

    svgEnter = svg.enter().append("svg");
    svg.merge(svgEnter).attr('width', width).attr('height', height);

    g = svg.merge(svgEnter)
      .selectAll('g.timeline__container')
      .data([1]);

    gEnter = g
      .enter()
      .append('g')
      .classed('timeline__container', true);

    g.merge(gEnter).attr('transform', 'translate(' + margin.top + ',' + margin.left + ')')

    calculateDimensions();
    expandLinks();
    drawConnections();
    drawDots('coin', 20);
    drawDots('actor', 150);
  }

  function calculateDimensions() {
    coinYearExtent[0] = _.minBy(data.coins, "date_earliest")["date_earliest"];
    coinYearExtent[1] = _.maxBy(data.coins, "date_latest")["date_latest"];
    actorYearExtent[0] = _.minBy(data.actors, "date_earliest")["date_earliest"];
    actorYearExtent[1] = _.maxBy(data.actors, "date_latest")["date_latest"];
    yearExtent[0] = _.max([coinYearExtent[0], actorYearExtent[0]])
    yearExtent[1] = _.max([coinYearExtent[1], actorYearExtent[1]])
    year2X.domain()
  }

  function expandLinks() {
    _.forEach(data.links, function(link) {
      link.source = _.find(data.coins, {id: link.source_id});
      link.target = _.find(data.actors, {id: link.target_id});
    })
  }

  function drawDots(key, offset) {
    var pluralKey = key + 's',
        group, groupEnter, dot, dotEnter;

    group = g.merge(gEnter).selectAll('g.timeline__'+pluralKey+'-group').data([1]);
    groupEnter = group.enter().append('g').classed('timeline__'+pluralKey+'-group', true);

    group.merge(groupEnter).attr('transform', 'translate(0, ' + offset + ')')

    dot = group
      .merge(groupEnter)
      .selectAll('circle.timeline__' + key)
      .data(data[pluralKey]);

    dotEnter = dot.enter().append('circle').classed('timeline__' + key, true);

    dot.merge(dotEnter)
      .attr('r', 2)
      .attr('cx', function(d) {
        return year2X(d.date_earliest)
      })
      .style('opacity', .1)
      .filter(function(d) {return d.date_earliest === null})
      .remove();
  }

  function drawConnections() {
    var group, groupEnter, connection, connectionEnter;

    group = g.merge(gEnter).selectAll('g.timeline__connections-group').data([1]);
    groupEnter = group.enter().append('g').classed('timeline__connections-group', true);

    connection = group
      .merge(groupEnter)
      .selectAll('line.timeline__connection')
      .data(_.filter(data.links, {role: "Dargestellte/r"}));

    connectionEnter = connection.enter().append('line').classed('timeline__connection', true);

    connection.merge(connectionEnter)
      .attr('x1', function(d) { return year2X(d.source.date_earliest) })
      .attr('x2', function(d) { return year2X(d.target.date_earliest) })
      .attr('y1', 20)
      .attr('y2', 100)
      .style('stroke', "#000")
      .style('opacity', .2);
  }

  _timeline.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _timeline;
  }

  return _timeline;
}