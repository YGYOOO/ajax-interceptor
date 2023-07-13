export const HEADERS_EXAMPLES = [{
  egText: `let headersArgs = arguments[0] ? arguments[0] : {}
headersArgs["Accept"] = "*/*"

return headersArgs
`
}]
export const REQUEST_PAYLOAD_EXAMPLES = [
  {
    egTitle: 'e.g. GET',
    egText: `const { requestUrl, queryStringParameters } = arguments[0]

let newRequestUrl = requestUrl.split('?')[0] + '?'
const queryParams = Object.assign(queryStringParameters, {
  // Add or replace the input parameters
  test: 'test123'
})
Object.keys(queryParams).forEach((key, index) => {
  if (index !== 0) newRequestUrl += '&'
  newRequestUrl += key+'='+queryParams[key]
})

return newRequestUrl
`
  },
  {
    egTitle: 'e.g. POST Json',
    egText: `// if args is Json
const args = arguments[0]

const params = JSON.parse(args)
params.test = 'test123'

return JSON.stringify(params)
`
  },
  {
    egTitle: 'e.g. POST FormData',
    egText: `// if args is FormData Object
const args = arguments[0]

args.append('test', 'test123')

return args
`
  }
]

export const RESPONSE_EXAMPLES = [
  {
    egTitle: 'e.g. json Basic',
    egText: `{
  "status": 200,
  "response": "OK"
}
`
  },
  {
    egTitle: 'e.g. javascript Basic',
    egText: `const data = []
for (let i = 0 i < 10 i++) {
  data.push({ id: i })
}

return {
  "status": 200,
  "response": data
}
`
  },
  {
    egTitle: 'e.g. javascript Mock.js',
    egText: `const data = Mock.mock({
  'list|1-10': [{
    'id|+1': 1
  }]
})

return {
  "status": 200,
  "response": data
}

// Mock.js: https://github.com/nuysoft/Mock/wiki/Getting-Started
`
  },
  {
    egTitle: 'e.g. javascript Create Scene',
    egText: `const { method, payload, originalResponse } = arguments[0]
if (method === 'get') { // Method
  // do something 
}
if (payload) { // parameters { queryStringParameters，requestPayload }
  // do something
}

return {
  "status": 200,
  "response": originalResponse
}
`
  }
]
