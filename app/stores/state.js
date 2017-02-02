import * as d3 from 'd3';
import layouter from 'app/layouter';

var _prevState = {};

var _state = {
  selectedProperties: [],
  selectedLayout: 'pile',
  selectedCoin: undefined
};

var dispatch = d3.dispatch('change');
var stateStore = {};

var setters = {
  selectedProperties: function(oldProp, newProp, key) {
    if(newProp.length > 2)
      newProp.shift();

    _state[key] = newProp;
    var applicableLayouts = layouter.getApplicableLayouts(_state);
    _state.selectedLayout = applicableLayouts[0].key;
  }
}

stateStore.get = function() {
  return _state;
}

stateStore.set = function(key, value, update) {
  if(setters[key] !== undefined)
    setters[key](_state[key], value, key);
  else
    _state[key] = value;
  if(update !== false)
    dispatch.call('change');
}

export default d3.rebind(stateStore, dispatch, 'on');