export default {
  coinProperties: [
    {
      key: 'title',
      value: 'Title',
      type: 'discrete',
      similarityWeight: 1,
      type: 'individual'
    },
    {
      key: 'production_country',
      value: 'Country',
      type: 'discrete',
      similarityWeight: 0.3
    },
    {
      key: 'production_region',
      value: 'Region',
      type: 'discrete',
      similarityWeight: 0.6
    },
    {
      key: 'production_minting_place',
      value: 'Minting Place',
      type: 'discrete',
      similarityWeight: 0.8
    },
/*    {
      key: 'weight',
      value: 'Weight',
      type: 'continuous'
    },
    {
      key: 'size',
      value: 'Size',
      type: 'continuous'
    },*/
    {
      key: 'date_earliest',
      value: 'Earliest Date',
      type: 'continuous',
      similarityWeight: 0.1
    },
    {
      key: 'date_latest',
      value: 'Last Date',
      type: 'continuous',
      similarityWeight: 0.1
    }
  ]
}