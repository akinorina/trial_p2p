const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 9500,
  path: '/peer',
  proxied: true
  // corsOptions: '*'
});
