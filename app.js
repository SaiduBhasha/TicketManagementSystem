// Include Hapi package
var Hapi = require('hapi');

// Create Server Object
var server = new Hapi.Server();

// Making connection with `theatreTicketSystem` database in your local machine
require('./config/db');
// Define PORT number You can change it if you want
server.connection({ port: 7002 });
server.route(require('./routes/api'));
server.register(
  {
    register: require('hapi-swagger'),
    options: {
      apiVersion: '0.0.1',
    },
  },
  function (err) {
    if (err) {
      server.log(['error'], 'hapi-swagger load error: ' + err);
    } else {
      server.log(['start'], 'hapi-swagger interface loaded');
    }
  }
);






//start the server
server.start(function () {
  console.log('Server running at:', server.info.uri);
});
