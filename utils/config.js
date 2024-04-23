const nodemailer = require('nodemailer')

var config = {
  secret_key: '',
  secret_key_alt: '',
  secret_key_no_token: '',
  amazonConfig: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  configBD: {
    userName: 'desarrollo',
    password: '',
    server: ``,
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
    password: '',
    server: ``,
    database: '',
    requestTimeout: 300000,
  },
  serverEmail: nodemailer.createTransport({
    // host: 'smtp-relay.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: '',
    },
  }),
}

module.exports = config
