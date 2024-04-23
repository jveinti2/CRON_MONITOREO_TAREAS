var mkpath = require("mkpath");
var fs = require("fs");
var async = require("async");
var http = require("http");
var request = require("request");
var Promise = require("bluebird");

const config = require("../utils/config");
const server = config.serverEmail;
const AWS = require("aws-sdk");

var utils = {
  // Decoding base-64 image
  // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
  decodeBase64Image: function (dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3) {
      return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], "base64");

    return response;
  },

  crearFileGestionDocumental: function (
    ruta,
    nombrearchivo,
    extension,
    archivo
  ) {
    mkpath(ruta, function (err) {
      console.log("detalle:", ruta, nombrearchivo, extension);
      console.log("archivo length", archivo.length);
      var saved = fs.writeFileSync(
        ruta + nombrearchivo + "." + extension,
        utils.decodeBase64Image(archivo).data
      );
      console.log("saved: ", saved);
    });
  },
  //http://stackoverflow.com/questions/6089058/nodejs-how-to-clone-a-object
  clone: function (a) {
    return JSON.parse(JSON.stringify(a));
  },
  downloadFileToDisk: function (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    file.on("finish", function () {
      file.close(cb); // close() is async, call cb after close completes.
    });
    request
      .get(url)
      .pipe(file)
      .on("error", function (err) {
        // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
      });
  },
  /**
   * genera codigo alfanumerico
   * http://jquery-manual.blogspot.com/2013/09/generar-codigo-aleatorio-partir-de.html
   * @param  {string} chars    secuencia de caracteres que formarán parte de la creación
   * @param  {int} longitud    la cantidad de secuencia que se devolvérán
   * @return {string}          secuencia aleatoria creada
   */
  generarAlfaNumerico: function (chars, longitud) {
    var code = "";
    for (var x = 0; x < longitud; x++) {
      var rand = Math.floor(Math.random() * chars.length);
      code += chars.substr(rand, 1);
    }
    return code;
  },

  /**
   * allow catch error async or sync.
   * source:https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
   * @param genFn
   * @returns {Function}
   */
  wrap: function (genFn) {
    var cr = Promise.coroutine(genFn);
    return function (req, res, next) {
      cr(req, res, next).catch(next);
    };
  },

  /**
   * utilidad para formatear los TO en la API SendinBlue
   * @param emails
   */
  formatearEmailSendinBlue: function (emails) {
    var emailAsociativo = emails
      .split(",")
      .reduce(function (itemPrevio, itemActual) {
        return `${itemPrevio}  "${itemActual}" : "${itemActual}" ,`;
      }, "{");
    emailAsociativo =
      emailAsociativo.substring(0, emailAsociativo.length - 1) + "}";

    return JSON.parse(emailAsociativo);
  },

  scanfilerecursive: function (dir, suffix, callback) {
    fs.readdir(dir, function (err, files) {
      var returnFiles = [];
      async.each(
        files,
        function (file, next) {
          var filePath = dir + "/" + file;
          fs.stat(filePath, function (err, stat) {
            if (err) {
              return next(err);
            }
            if (stat.isDirectory()) {
              utils.scanfilerecursive(
                filePath,
                suffix,
                function (err, results) {
                  if (err) {
                    return next(err);
                  }
                  returnFiles = returnFiles.concat(results);
                  next();
                }
              );
            } else if (stat.isFile()) {
              if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
                returnFiles.push(filePath);
              }
              next();
            }
          });
        },
        function (err) {
          callback(err, returnFiles);
        }
      );
    });
  },
  scanSyncfilerecursive: function (dir, filelist) {
    var fs = fs || require("fs"),
      files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
      if (fs.statSync(dir + "/" + file).isDirectory()) {
        filelist = utils.scanSyncfilerecursive(dir + "/" + file, filelist);
      } else {
        filelist.push(dir + "/" + file);
      }
    });
    return filelist;
  },
  isEmpty: function (obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  },
  sendEmailWithInviteCalendar: function (dataResponse) {
    const promiseEmail = function (optionsEmail) {
      return new Promise(function (resolve, reject) {
        server.sendMail(
          {
            text: "",
            from: "Notificaciones Madecentro <madecentro@madecentro.co>",
            to: optionsEmail.email,
            subject: optionsEmail.asunto,
            html: optionsEmail.html,
            attachments: optionsEmail.attachments,
          },
          function (err, message) {
            if (err) {
              reject({
                message: message,
                err: err,
              });
            }
            resolve();
          }
        );
      });
    };
    //const pathFile = `${dataResponse.sgd}/SGD/invite.ics`;
    let content_file = "";
    //const writeFile = fs.createWriteStream(pathFile, {flags: 'a'});
    dataResponse.evento_calendario.split("@@").forEach((item) => {
      content_file += item + "\n";
    });
    Promise.all([
      promiseEmail({
        email: dataResponse.email,
        asunto: dataResponse.asunto_email,
        html: dataResponse.plantilla_email,
        attachments: [
          {
            filename: "invite.ics",
            content: Buffer.from(content_file).toString("base64"),
            encoding: "base64",
          },
        ],
      }),
    ])
      .then((response) => {
        //fs.writeFile(pathFile, '', error => error);
      })
      .catch((response) => {
        console.log(response);
        //fs.writeFile(pathFile, '', error => error);
      });
  },

  cargaArchivoS3CV: function (body, parameters) {
    return new Promise((resolve, reject) => {
      const buf = new Buffer(
        body.cv_adjdunto_candidato_seleccion.replace(
          /^data:image\/\w+;base64,/,
          ""
        ),
        "base64"
      );
      AWS.config.update(config.amazonConfig);
      const s3 = new AWS.S3({
        signatureVersion: "v2",
      });
      const params = {
        Bucket: parameters.OUTPUT_RUTA_ARCHIVO.value,
        Key: parameters.OUTPUT_FILE_NAME_CV.value,
        Body: buf,
        ContentEncoding: "base64",
        ContentType: "application/pdf",
        ACL: "public-read",
      };
      s3.putObject(params, function (err, pres) {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  },

  copyPasteFileS3CV: function (body, parameters) {
    return new Promise((resolve, reject) => {
      let estructuraCarpetas = null;
      let nombre_archivo_existente = null;
      if (body.ruta_archivo != null && body.ruta_archivo != "") {
        nombre_archivo_existente = body.ruta_archivo.split("DCIN/");
        nombre_archivo_existente =
          nombre_archivo_existente.length > 1
            ? nombre_archivo_existente[1].replace(" ", "")
            : null;
        let url = body.ruta_archivo;
        let match = url.match(/https:\/\/.*?\/(.*?\/DCIN)\/.*?/);
        estructuraCarpetas = match ? match[1] : null;
      }
      const nuevoNombreDelArchivo = `${parameters.OUTPUT_FILE_NAME_CV.value}`;
      AWS.config.update(config.amazonConfig);
      const s3 = new AWS.S3({
        signatureVersion: "v2",
      });

      const params = {
        Bucket: parameters.OUTPUT_RUTA_ARCHIVO.value,
        CopySource: `${estructuraCarpetas}/${nombre_archivo_existente}`,
        Key: nuevoNombreDelArchivo,
        ACL: "public-read",
      };

      s3.copyObject(params, function (err, data) {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  },
};

module.exports = utils;
