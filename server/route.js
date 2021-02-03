const index = require('./routes/index');
const proxy = require('./routes/proxy');

const routesConfig = [
  {
    path: ['/api/proxy/*'],
    handler: proxy,
  },
  {
    path: '**',
    handler: index,
  },
];

function initRoute(app) {
  for (let i = 0, len = routesConfig.length; i < len; i++) {
    const con = routesConfig[i];
    app.use(con.path, con.handler);
  }
}

module.exports = initRoute;
