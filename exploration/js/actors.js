function RolesMultiples() {
  var data,
      root,
      svg,
      svgEnter,
      g,
      gEnter,
      width = 1200,
      height = 500,
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      role2Color = d3.scaleOrdinal()
      .domain(["Dargestellte/r","Muenzherr","Medailleur/in","Muenzmeister (MM Nz)","Muenzmeister (MM Ant)","Magistrat (Ant)","Entwurf","Stempelschneider"])
      .range(["#00C4B0","#FFBF00","#FF7E00","#FF033E","#bc8eea", "#a0179c","#D3212D","#3B7A57"]).unknown("#B2BEB5");

  function _rolesMultiples(_root) {
    root = _root;
    svg = root
      .selectAll("div")
      .data([1]);

    svgEnter = svg.enter().append("div");

    calculateDimensions();
    drawLegend();
    addLinksToActors();
    drawActors();
  }

  function calculateDimensions() {
  }

  function addLinksToActors() {
    _.forEach(data.actors, function(actor, i) {
      actor.roles = _.sortBy(_.filter(data.links, {target_id: actor.id}), function(actor) {
        if(role2Color.domain().indexOf(actor.role) === -1)
          return "zzzzz";
        return actor.role;
      });
    });

    data.actors = _.sortBy(data.actors, function(d) {
      return -d.roles.length;
    })
  }

  function addLinksToCoins() {
    _.forEach(data.coins, function(coin, i) {
      coin.roles = _(_.filter(data.links, {source_id: coin.id})).sortBy(function(link) {
        if(role2Color.domain().indexOf(link.role) === -1)
          return "zzzzz";
        return link.role;
      })
      .reverse()
      .value();
    });

    data.coins = _.sortBy(data.coins, function(d) {
      return -d.roles.length;
    });
  }

  function drawLegend() {
    var legend, item, itemEnter;
    legend = svgEnter
      .append('div')
      .style('margin-bottom', "30px");

    item = legend
      .selectAll('span')
      .data(role2Color.domain());

    itemEnter = item
      .enter()
      .append('span')
      .style('display', 'inline-block')
      .style('margin-right', '8px')

    itemEnter
      .append('span')
      .style('display', "inline-block")
      .style('width', "8px")
      .style('height', "8px")
      .style('margin-right', "3px")
      .style('background-color', function(d) {return role2Color(d);})

    itemEnter
      .append('span')
      .text(function(d) {return d;})
  }

  function drawActors() {
    var group, groupEnter, role, roleEnter, container, containerEnter;
    container = svg.merge(svgEnter).selectAll('div.multiples__container').data([1])
    containerEnter = container.enter().append('div').classed('multiples__container', true)
      .style('display', 'flex')
      .style('flex-wrap', 'wrap');

    group = container.merge(containerEnter).selectAll('div.multiples__actor').data(data.actors);

    groupEnter = group.enter().append('div').classed('multiples__actor', true)
      .style('margin-bottom', '15px')
      .style('margin-right', '10px')
      .style('line-height', 0)
      .style('width', '200px');

    var p = groupEnter
      .append('p').text(function(actor) {
        return actor.first_name + " " + actor.last_name + " (" + actor.date_earliest + "-" + actor.date_latest +")";
      })
      .style("line-height", "1.3em")
      .style("white-space", "nowrap")
      .style("overflow", "hidden")
      .style("text-overflow", "ellipsis");

    var links = groupEnter
      .append('p')
      .style("line-height", "1.3em")
      .style('color', function(d) { return d.uri_1.length ? "#f59" : "#999"})
      .style("white-space", "nowrap")
      .style("overflow", "hidden")
      .style("text-overflow", "ellipsis");

    links
      .append('a')
      .text(function(d) {return d.uri_1 ? "(1)" : ""})
      .attr('href', function(d) {return d.uri_1.length ? d.uri_1 : undefined});

    links
      .append('a')
      .text(function(d) {return d.uri_2 ? "(2)" : ""})
      .attr('href', function(d) {return d.uri_2.length ? d.uri_2 : undefined});

    links
      .append('a')
      .text(function(d) {return d.uri_3 ? "(3)" : ""})
      .attr('href', function(d) {return d.uri_3.length ? d.uri_3 : undefined});

    role = group.merge(groupEnter).selectAll('span.multiples__role').data(function(actor) {return actor.roles})

    roleEnter = role
      .enter()
      .append('span')
      .classed('multiples__role', true)
      .style('display', 'inline-block')
      .style('width', '3px')
      .style('height', '3px')
      .style('margin-right', '1px')
      .style('margin-top', '1px')
      .style('background-color', function(d){
        return role2Color(d.role)
      });
  }

  function drawCoins() {
    var group, groupEnter, role, roleEnter, container, containerEnter;
    container = svg.merge(svgEnter).selectAll('div.multiples__container').data([1])
    containerEnter = container.enter().append('div').classed('multiples__container', true)
      .style('display', 'flex')
      .style('flex-wrap', 'wrap')
      .style('align-items', 'flex-end');

    group = container.merge(containerEnter).selectAll('div.multiples__actor').data(data.coins);
    groupEnter = group.enter().append('div').classed('multiples__actor', true)
    .style('margin-bottom', '15px')

/*    groupEnter
      .append('span').text(function(coin) {
        return coin.title + " (" + coin.id + ")";
      });*/

    role = group.merge(groupEnter).selectAll('div.multiples__role').data(function(coin) {return coin.roles});

    roleEnter = role
      .enter()
      .append('div')
      .classed('multiples__role', true)
      .style('display', 'block')
      .style('width', '2px')
      .style('height', '8px')
      .style('margin-right', '2px')
      .style('background-color', function(d){
        return role2Color(d.role)
      });
  }

  _rolesMultiples.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _rolesMultiples;
  }

  return _rolesMultiples;
}

function expandData(compressed) {
  var raw = compressed.slice(1, compressed.length),
      keys = compressed[0],
      data = _.map(raw, function(d) {
        return _.zipObject(keys, d);
      });
  return data;
}


// APP

function app() {
  var _app = {},
      data = {},
      rolesMultiples = RolesMultiples()
      files = ["links", "actors"];

  function loadData() {
    _.map(files, function(file) {
      d3.json("../data/json/"+ file + "_short.json", function(err, response) {
        if(!err)
          data[file] = expandData(response);
          render();
      });
    });
  }

  function render() {
    if(data.links && data.actors) {
      rolesMultiples.data(data)
      d3.select("#root").call(rolesMultiples);
    }
  }

  _app.run = function() {
    loadData();
  }
  return _app;
}

window.onload = function() {
  app().run();
}