"use strict";

const config = require("./config");
const jwt = require("jwt-simple");
const moment = require("moment");

exports.createToken = (data, array_option_access = [], is_key_alt = false) => {
  const payload = {
    cs_id_usuario: data.cs_IdUsuario,
    cedula: data.cedula,
    email: data.UserName,
    c_id_perfil: data.c_id_perfil,
    c_cargo: data.c_cargo,
    d_cargo: data.d_cargo,
    nombre_usuario: `${data.PrimerNombre} ${data.PrimerApellido}`,
    foto_usuario: data.sw_madecentro
      ? `${data.Ruta_FotoPerfil}${data.Nombre_FotoPerfil}${data.Ext_FotoPerfil}`
      : null,
    iat: moment().unix(),
    exp: moment().add(1, "days").unix(),
    array_option_access: array_option_access,
  };
  return jwt.encode(payload, is_key_alt ? config.secret_key_alt : config.secret_key, "HS512");
};
