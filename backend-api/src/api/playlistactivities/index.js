const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist_activities',
  version: '1.0.0',
  register: async (server, { service, playlistsService }) => {
    //console.log('PlaylistActivities Plugin: received service:', service);
    //console.log('PlaylistActivities Plugin: received playlistsService:', playlistsService);
    //console.log('Does received playlistsService have verifyPlaylistAccess?', typeof playlistsService.verifyPlaylistAccess);
    const handler = new PlaylistActivitiesHandler(service, playlistsService);
    server.route(routes(handler));
  },
};