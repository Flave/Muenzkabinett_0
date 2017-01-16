from lxml import etree
import pprint

pp = pprint.PrettyPrinter(indent=4)
ns = {'lido': 'http://www.lido-schema.org', 'xml': 'someuri'}
production_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Herstellung")]]'

specs = [
  {
    'key': 'object_type',
    'path': '//lido:objectWorkType/lido:term/text()'
  },
  {
    'key': 'nominal',
    'path': '//lido:classificationWrap//lido:term[@lido:label="nominal"]/text()'
  },
  {
    'key': 'division',
    'path': '//lido:classificationWrap//lido:term[@lido:label="division"]/text()'
  },
  {
    'key': 'subdivision',
    'path': '//lido:classificationWrap//lido:term[@lido:label="subdivision"]/text()'
  },
  {
    'key': 'title',
    'path': '//lido:objectIdentificationWrap//lido:titleSet/lido:appellationValue/text()'
  },
  {
    'key': 'inscription_front',
    'path': '//lido:inscriptions[@lido:type="front"]/lido:inscriptionTranscription/text()'
  },
  {
    'key': 'inscription_description_front',
    'path': '//lido:inscriptions[@lido:type="front"]//lido:descriptiveNoteValue/text()'
  },
  {
    'key': 'inscription_back',
    'path': '//lido:inscriptions[@lido:type="back"]/lido:inscriptionTranscription/text()'
  },
  {
    'key': 'inscription_description_back',
    'path': '//lido:inscriptions[@lido:type="back"]//lido:descriptiveNoteValue/text()'
  },
  {
    'key': 'inscription_edge',
    'path': '//lido:inscriptions[@lido:type="edge"]/lido:inscriptionTranscription/text()'
  },
  {
    'key': 'inscription_description_edge',
    'path': '//lido:inscriptions[@lido:type="edge"]//lido:descriptiveNoteValue/text()'
  },
  {
    'key': 'minting_authority',
    'path': '//lido:descriptiveNoteValue[@lido:label="minting_authority"]/text()'
  },
  {
    'key': 'accession',
    'path': '//lido:descriptiveNoteValue[@lido:label="Accession"]/text()'
  },
  {
    'key': 'provenience',
    'path': '//lido:descriptiveNoteValue[@lido:label="provenience"]/text()'
  },

  # MEASUREMENTS
  {
    'key': 'height',
    'path': '//lido:measurementType[contains(text(), "height")]/following-sibling::lido:measurementValue/text()'
  },
  {
    'key': 'width',
    'path': '//lido:measurementType[contains(text(), "width")]/following-sibling::lido:measurementValue/text()'
  },
  {
    'key': 'diameter',
    'path': '//lido:measurementType[contains(text(), "diameter")]/following-sibling::lido:measurementValue/text()'
  },
  {
    'key': 'weight',
    'path': '//lido:measurementType[contains(text(), "weight")]/following-sibling::lido:measurementValue/text()'
  },
  {
    'key': 'orientation',
    'path': '//lido:measurementType[contains(text(), "orientation")]/following-sibling::lido:measurementValue/text()'
  },

  # EVENTS
  {
    'key': 'production_earliest',
    'path': '//lido:earliestDate/text()'
  },
  {
    'key': 'production_latest',
    'path': production_event_set + '//lido:latestDate/text()'
  },
  {
    'key': 'production_period_name',
    'path': production_event_set + '//lido:periodName/lido:term/text()'
  },
  {
    'key': 'production_country',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="country"]//lido:appellationValue/text()'
  },
  {
    'key': 'production_region',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="region"]//lido:appellationValue/text()'
  },
  {
    'key': 'production_minting_place',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="minting_place"]//lido:appellationValue/text()'
  },
  {
    'key': 'production_material',
    'path': production_event_set + '//lido:termMaterialsTech[@lido:type="material"]//lido:term/text()'
  },
  {
    'key': 'production_technique',
    'path': production_event_set + '//lido:termMaterialsTech[@lido:type="technique"]//lido:term/text()'
  }
]

def parseFile(data, fileName):
  tree = etree.parse('../data/xml/' + fileName)
  data.append(fileName.replace('.xml', ''))
  parseValues(data, tree, specs)
  return data

def parseValues(data, tree, specs):
  for i, spec in enumerate(specs):
    data.append(parseValue(tree, spec['path'], spec['key']))

def parseValue(tree, path, key):
  value = tree.xpath(path, namespaces=ns)
  if(len(value) > 0):
    return value[0]
  else:
    return None


def getKeys():
  keys = []
  for spec in specs:
    keys.append(spec['key'])
  keys.insert(0, 'id')
  return keys