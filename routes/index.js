// const fs = require('fs');
// const path = require('path');

// function scanSyncFileRecursive(dir, app){
//     fs.readdirSync(dir).forEach(file => {
//         let ruta = `${dir}/${file}`;
//         if(!file.includes('index.js')){
//             if(fs.statSync(ruta).isDirectory()){
//                 filelist = scanSyncFileRecursive(ruta, app);
//             }else{
//                 const modulo_ruta = require(`../${ruta}`);
//                 ruta = ruta.replace('routes', '').replace('.js', '');
//                 console.log('Cargando rutas...', ruta)
//                 app.use(ruta, modulo_ruta);
//             }
//         }
//     });
// }

// module.exports = function(app){
//     scanSyncFileRecursive('routes', app)
// }

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express v4.1' });
});

router.get('/restartnodejs', function(req, res, next) {

  //var resultado = exec('forever restart', {silent : true}).output;
  res.json({"ok" : "200", "resultado" : resultado});
});

router.get('/stopallnodejs', function(req, res, next) {

  //var resultado = exec('forever stopall', {silent : true}).output;
  res.json({"ok" : "200", "resultado" : resultado});
});

module.exports = router;
