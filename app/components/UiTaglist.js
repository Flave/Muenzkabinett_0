import * as d3 from 'd3';
import hogan from 'hogan.js';
import Template from 'app/templates/uiTaglist.template';

var tags = [
  {
    key: 'production_country',
    value: 'Country',
    type: 'discrete'
  },
  {
    key: 'production_region',
    value: 'Region',
    type: 'discrete'
  },
  {
    key: 'production_minting_place',
    value: 'Minting Place',
    type: 'discrete'
  },
  {
    key: 'production_minting_place',
    value: 'Minting Place',
    type: 'discrete'
  },
  {
    key: 'weight',
    value: 'Weight',
    type: 'continuous'
  },
  {
    key: 'size',
    value: 'Size',
    type: 'continuous'
  },
  {
    key: 'date_earliest',
    value: 'Earliest Date',
    type: 'continuous'
  },
  {
    key: 'date_latest',
    value: 'Last Date',
    type: 'continuous'
  }
]

export default function UiTaglist() {
  var template = hogan.compile(Template),
      dispatch = d3.dispatch('click');

  function uiTaglist(container) {
    container.html(template.render({tags: tags}));
    container
      .selectAll('.ui-taglist__tag')
      .on('click', onTabClick);

    return uiTaglist;
  }

  function onTabClick(d, i) {
    console.log(tags[i]);
  }



  uiTaglist.state = function(_) {
    if(!arguments.length) return size;
    size = _;
    return uiTaglist;
  }

  return d3.rebind(uiTaglist, dispatch, 'on');
}