import './utils';
import loader from './loader';
import * as d3 from 'd3';
import coins from 'app/stores/coins';
import Canvas from 'app/Canvas';

var app = {},
    size = {},
    canvas = Canvas();

app.init = function() {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  canvas.size(size)
  canvas();


  loader.load()
    .on('coinsLoaded', function() {
      canvas.render();
    })
}

export default app;