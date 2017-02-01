import './utils';
import loader from './loader';
import * as d3 from 'd3';
import stateStore from 'app/stores/state';
import coins from 'app/stores/coins';
import Canvas from 'app/Canvas';
import layouter from 'app/layouter';
import Ui from 'app/Ui';

var app = {},
    size = {},
    canvas = Canvas(),
    ui = Ui();


app.init = function() {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  canvas.size(size)
  canvas(document.getElementById("canvas-container"));

  ui(d3.select("#ui-container")).on('click', app.init);

  loader.load()
    .on('coinsLoaded', function() {
      canvas.init();
    });

  stateStore.on('change.app', function() {
    console.log(layouter.getApplicableLayouts());
  })
}

export default app;