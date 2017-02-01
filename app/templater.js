import _template from 'lodash.template';
import _forEach from 'lodash.foreach';

/*var templateSettings = {
    evaluate:    /{{([\s\S]+?)}}/g,
    interpolate: /{{%([\s\S]+?)}}/g,
    escape:      /{{-([\s\S]+?)}}/g
};*/

function templater(templateString) {
  var template = _template(templateString);
  return function(data) {
    data = data || {};
    data.forEach = _forEach;
    return template(data);
  }
}

export default templater;