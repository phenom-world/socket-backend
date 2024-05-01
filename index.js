const colors = require('colors');
const { app } = require('./app.js');
const { WebSocketServer, OPEN } = require('ws');
const { saveLampPost, lamPostSavedinPastHour } = require('./helpers/lampost.js');

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

wss.on('connection', function connection(ws) {
  ws.on('message', async function (message) {
    Array.from(wss.clients)
      .filter((client) => client !== ws && client.readyState === OPEN)
      .forEach(function (client) {
        console.log(JSON.parse(message));
        client.send(JSON.stringify(JSON.parse(message)));
      });
    const data = JSON.parse(message);
    if (data?.action === 'live') {
      const data = JSON.parse(message);
      const isSaved = await lamPostSavedinPastHour(data?.post_id);
      if (!isSaved) {
        saveLampPost(data)
          .then((lampPost) => {
            console.log('lampPost saved:', lampPost);
          })
          .catch((error) => {
            console.error('Error saving lampPost:', error);
          });
      }
    }
  });
});

const server = http.listen(PORT, () => {
  console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
