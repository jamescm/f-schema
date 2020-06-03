# F Schema
A simple Node library for converting JSON to JSON Schema.

## Installation

```bash
npm install f-schema
```

## Usage

```js
import toJSONSchema from 'f-schema'

toJSONSchema({ my: { json: { value: 1 }}})
/*
 * {
 *   "$schema": "http://json-schema.org/draft-07/schema#",
 *   "type": "object",
 *   "properties": {
 *     "my": {
 *       "type": "object",
 *       "properties": {
 *         "json": {
 *           "type": "object",
 *           "properties": {
 *             "value": {
 *               "type": "integer"
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */

```

Additionally, a transformation callback can be passed to transform any node.
```js
import toJSONSchema 'f-schema'

const onProcess = node => ({ ...node, required: 'true' })
toJSONSchema({ my: { json: { value: 1 }}}, { onProcess })

/*
* {
*   "$schema": "http://json-schema.org/draft-07/schema#",
*   "type": "object",
*   "properties": {
*     "my": {
*       "type": "object",
*       "properties": {
*         "json": {
*           "type": "object",
*           "properties": {
*             "value": {
*               "type": "integer",
*               "required": "true"
*             }
*           },
*           "required": "true"
*         }
*       },
*       "required": "true"
*     }
*   },
*   "required": "true"
* }
*/
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC](https://choosealicense.com/licenses/isc/)