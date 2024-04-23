const nodemailer = require('nodemailer')

var config = {
  secret_key: 'GHbFU9xZgXqBwAdcf5pwXHA3tcf23PUzGsK7rcny',
  secret_key_alt: 't#Yw3=BFMgySDqZW@bCK',
  secret_key_no_token: 'YRLt6xsbKse3-B!Rb%wPeRCQ_R6_Yt_STrDJ#xG67hm3uKQ+Tu',
  amazonConfig: {
    accessKeyId: 'AKIAJ53CG32YCV4T4ZWA',
    secretAccessKey: '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',
  },
  configBD: {
    userName: 'desarrollo',
    password: 'Mdcdllo2015',
    server: `192.168.73.20\\APOLO5`,
    options: {
      // instanceName                    : 'MDCDLLO',
      database: '',
      rowCollectionOnDone: true,
      rowCollectionOnRequestCompletion: true,
      useUTC: false,
      requestTimeout: 300000,
    },
  },
  configBD2: {
    user: 'desarrollo',
    password: 'Mdcdllo2015',
    server: `192.168.73.20\\APOLO5`,
    database: '',
    requestTimeout: 300000,
  },
  serverEmail: nodemailer.createTransport({
    // host: 'smtp-relay.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: 'madecentro@madecentro.co',
      pass: 'MDC811028650*',
    },
  }),
}

module.exports = config
