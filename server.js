import app from './app.js';

const PORT = 3009;
const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection, shutting down...', {
    name: error.name,
    message: error.message,
  });
  server.close(() => {
    process.exit(1);
  });
});
