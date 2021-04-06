const fastify = require('fastify');

function init() {
  const app = fastify();
  app.get('/', (request, reply) => reply.send({ hello: 'world' }));
  return app;
}

// if (require.main === module) {
console.log('GOING TO INIT');
// called directly i.e. "node app"
init().listen(3000, (err) => {
  if (err) console.error(err);
  console.log('server listening on 3000');
});
// } else {
//   console.log('GOING TO EXPORT');
//   module.exports = init;
// }

module.exports = init;
