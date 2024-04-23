'use strict'
const qs = require('qs');
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');
const typeis = require('type-is');
const multiparty = require('multiparty');
const onFinished = require('on-finished');

exports.validarAcceso = (req, res, next, is_key_alt = false) => {
    if (!req.headers.authorization) return res.status(403).send({ message: 'No tiene permisos para acceder. Debe ingresar al sistema de nuevo' });
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, !is_key_alt ? config.secret_key : config.secret_key_alt);
        if (payload.exp <= moment().unix()) return res.status(401).send({ message: 'El token ha expirado. Debe ingresar al sistema de nuevo' });
    } catch (error) {        
        return res.status(401).send({ message: 'Token no válido. Debe ingresar al sistema de nuevo' });
    }
    req.user = payload;
    next();
}
exports.validarAccesoSinUsuarioToken = (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).send({ message: 'No tiene permisos para acceder.' });
    if (req.headers.authorization != config.secret_key_no_token) return res.status(401).send({ message: 'Error al acceder' });
    next();
};
exports.verificarAccesoWithHeaders = (req, res, next) => {
    if(req.headers['no-token']){
        this.validarAccesoSinUsuarioToken(req, res, next);
    }else{
        this.validarAcceso(req, res, next, req.headers['token-gen'] ? false : true);
    }
}