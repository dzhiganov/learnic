const awsLambdaFastify = require('aws-lambda-fastify');
const app = require('./app');

const proxy = awsLambdaFastify(app);
// or
// const proxy = awsLambdaFastify(init(), { binaryMimeTypes: ['application/octet-stream'] })

exports.handler = proxy;
// exports.handler = async (event, context) => {
//   const { name } = event.queryStringParameters;
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: `Hello ${name || 'World'}` }),
//   };
// };
// or
// exports.handler = (event, context, callback) => proxy(event, context, callback);
// or
// exports.handler = (event, context) => proxy(event, context);
// or
// exports.handler = async (event, context) => proxy(event, context);
