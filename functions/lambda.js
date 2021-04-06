const awsLambdaFastify = require('aws-lambda-fastify');
const init = require('./app');

const proxy = awsLambdaFastify(init());
// or
// const proxy = awsLambdaFastify(init(), { binaryMimeTypes: ['application/octet-stream'] })

exports.handler = (event, context, callback) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World' }),
  };
  //   return proxy(event, context, callback);
};
// or
// exports.handler = (event, context) => proxy(event, context);
// or
// exports.handler = async (event, context) => proxy(event, context);
