const fastify = require('fastify');

function init() {
  const app = fastify();
  app.get('/', (request, reply) => reply.send({ hello: 'world' }));
  return app;
}

if (require.main === module) {

// called directly i.e. "node app"
init().listen(7777, (err) => {
  if (err) console.error(err);
  console.log('server listening on 7777');
});
} else {
//   console.log('GOING TO EXPORT');
  module.exports = init;
}

module.exports = init;
