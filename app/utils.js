import * as d3 from 'd3';

// Copies a variable number of methods from source to target.
d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}