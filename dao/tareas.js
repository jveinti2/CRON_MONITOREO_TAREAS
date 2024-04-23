var sql = require('mssql')
var CONSTANTES = require('../utils/constantes')
var config = require('../utils/config')
var utils = require('../utils/utils')
var moment = require('moment')

var tareas_dao = {
  // Ejecucion del SSP_INSERT_NIVEL_SERVICIO_PV
  // cron_run_SSP_INSERT_NIVEL_SERVICIO_PV: function () {
  //   console.log('>>>>>>> Ejecutando SSP_INSERT_NIVEL_SERVICIO_PV <<<<<<<<')
  //   var conexion = utils.clone(config.configBD2)

  //   conexion.database = CONSTANTES.DWH
  //   const SSP_NAME = 'DWH.SSP_INSERT_NIVEL_SERVICIO_PV'

  //   var connection = new sql.Connection(conexion, function (err) {
  //     if (err) {
  //       console.log('XXX Error en la conexión: ', err)
  //       return
  //     }

  //     var request = new sql.Request(connection)
  //     request.verbose = false

  //     request.input('IN_ANO', sql.SmallInt, moment().year())
  //     request.input('IN_MES', sql.SmallInt, moment().month())
  //     request.execute(SSP_NAME, function (err, recordset, returnValue) {
  //       var log = err ? `${err}` : 'OK'
  //       connection.close()

  //       if (err) {
  //         console.log('XXX Error en la ejecución del SSP: ', err)
  //         return
  //       }

  //       // Ejecutar el log
  //       tareas_dao.log_ejecucion(SSP_NAME, log)
  //     })
  //   })
  // },

  // Ejecucion del SSP_TEST_CRON
  cron_run_SSP_TEST_CRON: function () {
    console.log('>>>>>>> Ejecutando SSP_TEST_CRON <<<<<<<<')
    var conexion = utils.clone(config.configBD2)

    conexion.database = CONSTANTES.CORPORATIVADB
    const SSP_NAME = 'CORPORATIVA.SSP_TEST_CRON'

    var connection = new sql.Connection(conexion, function (err) {
      if (err) {
        console.log('XXX Error en la conexión: ', err)
        return
      }

      var request = new sql.Request(connection)
      request.verbose = false

      request.input('IN_ANO', sql.SmallInt, moment().year())
      request.input('IN_MES', sql.SmallInt, moment().month())
      request.execute(SSP_NAME, function (err, recordset, returnValue) {
        const log = err ? `${err}` : 'OK'
        connection.close()

        // Ejecutar el log
        tareas_dao.log_ejecucion(SSP_NAME, log)
      })
    })
  },
  // Ejecucion del SSP_TEST_CRON2
  cron_run_SSP_TEST_CRON2: function () {
    console.log('>>>>>>> Ejecutando SSP_TEST_CRON2 <<<<<<<<')
    var conexion = utils.clone(config.configBD2)

    conexion.database = CONSTANTES.CORPORATIVADB
    const SSP_NAME = 'CORPORATIVA.SSP_TEST_CRON2'

    var connection = new sql.Connection(conexion, function (err) {
      if (err) {
        console.log('XXX Error en la conexión: ', err)
        return
      }

      var request = new sql.Request(connection)
      request.verbose = false

      // request.input('IN_ANO', sql.SmallInt, moment().year())
      request.input('IN_MES', sql.SmallInt, moment().month())
      request.execute(SSP_NAME, function (err, recordset, returnValue) {
        const log = err ? `${err}` : 'OK'
        connection.close()

        // Ejecutar el log
        tareas_dao.log_ejecucion(SSP_NAME, log)
      })
    })
  },

  // funcion de log
  log_ejecucion: function (ssp_name, respuesta_ejecucion) {
    var conexion = utils.clone(config.configBD2)
    conexion.database = CONSTANTES.CORPORATIVADB

    var connection = new sql.Connection(conexion, function (err) {
      if (err) {
        console.log('XXX Error en la conexión: ', err)
        return
      }

      var request = new sql.Request(connection)
      request.verbose = false

      request.input('IN_SSP_NAME', sql.VarChar, ssp_name)
      request.input('IN_RESPUESTA_EJECUCION', sql.VarChar, respuesta_ejecucion)
      request.execute('CORPORATIVA.SSP_LOG_TAREAS', function (err, recordset, returnValue) {
        connection.close()
        console.log(
          '>>>>>>> Finalizando SSP_INSERT_NIVEL_SERVICIO_PV <<<<<<<<:',
          respuesta_ejecucion
        )
      })
    })
  },

  init_job_run_tareas: function () {
    console.log('======= Cron iniciado =======')
    let CronJob = require('cron').CronJob
    let timeZone = 'America/Santiago'

    //Seconds: 0-59 *
    //Minutes: 0-59 * (*/1 cada min)
    //Hours: 0-23 *
    //Day of Month: 1-31 *
    //Months: 0-11 *
    //Day of Week: 0-6 *

    let job = new CronJob(
      '*/15 * * * * *',
      () => {
        console.log('======= Tarea iniciada =======')
        tareas_dao.cron_run_SSP_TEST_CRON()
      },
      () => {
        console.log('======= Cron finalizado =======')
      },
      false,
      timeZone
    )
    let job2 = new CronJob(
      '*/30 * * * * *',
      () => {
        console.log('======= Tarea iniciada =======')
        tareas_dao.cron_run_SSP_TEST_CRON2()
      },
      () => {
        console.log('======= Cron finalizado =======')
      },
      false,
      timeZone
    )

    job.start()
    job2.start()
  },
}

module.exports = tareas_dao
