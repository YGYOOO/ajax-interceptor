export const HEADERS_EXAMPLES = [{
  egText: `/**
 * Modify headers here
 **/

/* console to see the arguments */
// console.log(...arguments)

/* get origin headers */
let headersArgs = arguments[0] ? arguments[0] : {}
/* modify headers */
headersArgs["Accept"] = "*/*"

/* return new headers */
return headersArgs
`
}]
export const REQUEST_PAYLOAD_EXAMPLES = [
  {
    egTitle: 'e.g. GET',
    egText: `/**
 * Modify payload here
 * This example is of GET method.
 **/

/* console to see the arguments */
// console.log(...arguments)

/* get origin url and params */
const {
  requestUrl,
  queryParams
} = arguments[0]

let newRequestUrl = requestUrl.split('?')[0] + '?'

/* modify params */
const newQueryParams = Object.assign(queryParams, {
  test: 'test123'
})

/* connect url and params */
Object.keys(newQueryParams).forEach((key, index) => {
  if (index !== 0) newRequestUrl += '&'
  newRequestUrl += key + '=' + newQueryParams[key]
})

/* return new request url */
return newRequestUrl
`
  },
  {
    egTitle: 'e.g. POST JSON',
    egText: `/**
 * Modify payload here
 * This example is of POST Method and JSON type.
 **/

/* console to see the arguments */
// console.log(...arguments)

/* get origin payload */
const orgArgs = arguments[0]

/* modify payload */
const newParams = JSON.parse(orgArgs)
newParams.test = 'test123'

/* return new payload */
return JSON.stringify(newParams)
`
  },
  {
    egTitle: 'e.g. POST FormData',
    egText: `/**
 * Modify payload here
 * This example is of POST Method and FormData type.
 **/

/* console to see the arguments */
// console.log(...arguments)

/* get origin payload */
const newArgs = arguments[0]

/* modify payload */
newArgs.append('test', 'test123')

/* return new payload */
return newArgs
`
  }
]

export const RESPONSE_EXAMPLES = [
  {
    egTitle: 'e.g. json',
    egText: `{
  "status": 200,
  "response": "OK"
}
`,
    egLanguage: 'json'
  },
//   {
//     egTitle: 'e.g. javascript Basic',
//     egText: `const data = []
// for (let i = 0; i < 10; i++) {
//   data.push({ id: i })
// }
//
// return {
//   "status": 200,
//   "response": data
// }
// `
//   },
//   {
//     egTitle: 'e.g. javascript Mock.js',
//     egText: `const data = Mock.mock({
//   'list|1-10': [{
//     'id|+1': 1
//   }]
// })
//
// return {
//   "status": 200,
//   "response": data
// }
//
// // Mock.js: https://github.com/nuysoft/Mock/wiki/Getting-Started
// `
//   },
//   {
//     egTitle: 'e.g. javascript Create Scene',
//     egText: `const { method, payload, originalResponse } = arguments[0]
// if (method === 'get') { // Method
//   // do something
// }
// if (payload) { // parameters { queryParams，requestPayload }
//   // do something
// }
//
// return {
//   "status": 200,
//   "response": originalResponse
// }
// `
//   }
]
