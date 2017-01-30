import _template from 'lodash.template';

var templateSettings = {
    evaluate:    /{{([\s\S]+?)}}/g,
    interpolate: /{{%([\s\S]+?)}}/g,
    escape:      /{{-([\s\S]+?)}}/g
};

function templater(templateString) {
  return _template(templateString, templateSettings);
}

export default templater;