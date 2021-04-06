const Fastify = require('fastify');

const app = Fastify({ logger: true });

if (require.main === module) {
  // called directly i.e. "ts-node server/app.js"
  app.listen(29754);
}

module.exports = app;
