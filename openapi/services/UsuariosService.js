/* eslint-disable no-unused-vars */
const Service = require('./Service');
const mysql = require('mysql2/promise');

// https://sidorares.github.io/node-mysql2/docs aqui explica como hacer la conexion y las peticiones pero usa otro modelo de node, conque he usado ia para pedirle que me explique los cambios de notacion y como aplicarlos a mi codigo

// https://sidorares.github.io/node-mysql2/docs#using-prepared-statements aqui usa lo de await de conseguir la conexion. Tambien dice algo de pool, pero me parece mucho lio

// tambien dice algo de prepared statements para evitar inyeccion sql por parte de atacantes, pero la práctica no pide nada así, conque paso

let conexion; // aqui guardo la conexion a la base de datos para no tener que hacer mysqlcreateConnection para cada peticion a la base de datos

const conseguirConexion = async () => { // esta funcion solo la necesito porque al parecer hay dos formas de importar módulos de nodejs y openapi usa algo llamdo CommonJS y lo de la página de la que he sacado las referencias se usa ES Modules, conque la notación cambia y tengo que usar los awaits siempre dentro de async

  if(!conexion) {// si aun no he hecho la conexion a la base de datos, la hago
    conexion = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dism',
    }); 
  }

  return conexion;
}

/**
* GET usuarios
*
* returns List
* */
const usuariosGET = () => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirConexion(); // por si aun no he hecho la conexion a la base de datos en otra peticion previa. Esto lo voy a poner en todas las peticiones, si ya existe no consume mucho proceso porque no entra en el if.
      
      const [filas] = await conexion.query('SELECT * FROM usuarios');
      resolve(Service.successResponse(
        filas,
      ));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* DELETE usuario
*
* identificador Integer 
* no response value expected for this operation
* */
const usuariosIdentificadorDELETE = ({ identificador }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        identificador,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* GET usuario concreto
*
* identificador Integer Id del usuario
* returns List
* */
const usuariosIdentificadorGET = ({ identificador }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        identificador,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* PUT usuario
*
* identificador Integer 
* usuario Usuario 
* no response value expected for this operation
* */
const usuariosIdentificadorPUT = ({ identificador, usuario }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        identificador,
        usuario,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* POST usuarios
*
* usuario Usuario 
* no response value expected for this operation
* */
const usuariosPOST = ({ usuario }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        usuario,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  usuariosGET,
  usuariosIdentificadorDELETE,
  usuariosIdentificadorGET,
  usuariosIdentificadorPUT,
  usuariosPOST,
};
