var express = require('express')
var fs = require('fs')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')

var utils = require('./utils/utils')
var deployPath = process.env.deployPath || ''
var app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
var routesDir = 'routes'
var archivos = []
console.log('=========================== síncrono ======================')

// Eejcucuon del cron
var tareas_dao = require('./dao/tareas')

tareas_dao.init_job_run_tareas()

utils.scanSyncfilerecursive(routesDir, archivos)
archivos.forEach((file) => {
  var moduloRuta = require('./' + file)
  var ruta = file.replace('routes', '').replace('.js', '')
  if (ruta === '/index') {
    ruta = '/'
  }
  console.log('cargando ruta...', file)
  app.use(deployPath + ruta, moduloRuta)
})

app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.redirect('/404')
  })
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,x-xsrf-token'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

app.use(function (err, req, res, next) {
  console.log('status', err.message)
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {},
  })
})

module.exports = app
