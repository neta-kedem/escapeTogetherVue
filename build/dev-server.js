require('./check-versions')()
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = config.dev.env
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

app.get('/pannellum/pannellum.js', (req, res)=>{
 res.sendFile(__dirname + '/pannellum/pannellum.js');
});
app.get('/pannellum/libpannellum.js', (req, res)=>{
 res.sendFile(__dirname + '/pannellum/libpannellum.js');
});
app.get('/pannellum/img/:id', (req, res)=>{
 res.sendFile(__dirname + '/pannellum/img/'+req.params.id);
});
app.get('/img/artifacts/:id', (req, res)=>{
 res.sendFile(__dirname + '/img/artifacts/'+req.params.id);
});
app.get('/img/panoramas/:room/:folder/:id', (req, res)=>{
 res.sendFile(__dirname + '/img/panoramas/'+req.params.room+'/'+req.params.folder+'/'+req.params.id);
});
app.get('/img/scenes/:id', (req, res)=>{
 res.sendFile(__dirname + '/img/scenes/'+req.params.id);
});
app.get('/favicon.ico', (req, res)=>{
 res.sendFile(__dirname + '/img/icon04.png');
});
app.get('/manifest.json', (req, res)=>{
 res.sendFile(__dirname + '/manifest.json');
});

app.get('/img/:id', (req, res)=>{
 res.sendFile(__dirname +'/img/'+ req.params.id);
});


module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
