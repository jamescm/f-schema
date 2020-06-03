const R = require('ramda')

const onProcessLens = R.lensProp('onProcess')

const lensSatisfies = R.curryN(3,
  (predicate, lens, data) => R.pipe(R.view(lens), predicate, R.equals(true))(data)
)

const reduceSchema = R.curryN(2, (schema, options) => R.pipe(
  R.cond([
    [isPrimitive, toPrimitive],
    [R.is(Array), toArray(R.__, options)],
    [R.is(Object), toObject(R.__, options)],
    [R.T, R.identity]
  ]),
  R.unless(
    R.thunkify(lensSatisfies)(R.isNil, onProcessLens, options),
    R.view(onProcessLens, options)
  )
)(schema))

const isPrimitive = R.anyPass([
  R.is(Number),
  R.is(String),
  R.is(BigInt),
  R.is(Boolean),
  R.isNil
])

const schemaType = R.pipe(
  R.type,
  R.cond([
    [R.equals('Number'), R.always('Integer')],
    [R.equals('Undefined'), R.always('Null')],
    [R.T, R.identity]
  ]),
  R.toLower
)

const toPrimitive = R.pipe(
  schemaType,
  R.objOf('type')
)

const toArray = R.curryN(2,
  (schema, options) => R.pipe(
    R.head,
    reduceSchema(R.__, options),
    R.of,
    R.objOf('items'),
    R.mergeRight({ type: 'array' })
  )(schema))

const toObject = R.curryN(2,
  (schema, options) =>
    R.pipe(
      R.map(reduceSchema(R.__, options)),
      R.objOf('properties'),
      R.mergeRight({ type: 'object' })
    )(schema))

module.exports = (data, options) => ({
  '$schema': 'http://json-schema.org/draft-07/schema#',
  ...reduceSchema(data, options)
})
