var _state = {
  someVariable: false
};

var stateStore = {};

stateStore.get = function() {
  return _state;
}

export default stateStore;