const colors = require('colors');
const { app } = require('./app.js');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 80;

process.on('uncaughtException', (error) => {
  console.log(colors.red.bold(`uncaught exception: ${error.message}`));
  process.exit(1);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});

const http = require('http').createServer(app);

const wss = new WebSocketServer({
  server: http,
  path: '/ws',
});

const clients = [];

wss.on('connection', function connection(ws) {
  clients.push({ id: ws._socket._handle.fd, ws });
  ws.on('message', function (message) {
    clients
      .filter((item) => item.id !== ws._socket._handle.fd)
      .forEach(function (client) {
        client.ws.send(JSON.stringify(JSON.parse(message)));
      });
  });
});

const server = http.listen(PORT, () => {
  console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
