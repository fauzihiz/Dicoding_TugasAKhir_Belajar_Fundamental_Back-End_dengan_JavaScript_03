const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageService, albumsService, validator }) => {
    const handler = new UploadsHandler(storageService, albumsService, validator);
    server.route(routes(handler));
  },
};