import * as d3 from 'd3';

var _state = {
  selectedProperties: []
};

var dispatch = d3.dispatch('change');
var stateStore = {};

var setters = {
  selectedProperties: function(oldProp, newProp, key) {
    if(newProp.length > 2)
      newProp.shift();

    _state[key] = newProp;
    console.log(_state[key]);
  }
}

stateStore.get = function() {
  return _state;
}

stateStore.set = function(key, value) {
  if(setters[key] !== undefined)
    setters[key](_state[key], value, key);
  else
    _state[key] = property;

  dispatch.call('change');
}

export default d3.rebind(stateStore, dispatch, 'on');