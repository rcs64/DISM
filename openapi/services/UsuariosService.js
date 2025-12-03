/* eslint-disable no-unused-vars */
const Service = require('./Service');
const mysql = require('mysql2/promise');

// https://sidorares.github.io/node-mysql2/docs aqui explica como hacer la pool y las peticiones pero usa otro modelo de node, conque he usado ia para pedirle que me explique los cambios de notacion y como aplicarlos a mi codigo

// https://sidorares.github.io/node-mysql2/docs#using-prepared-statements aqui usa lo de await de conseguir la pool. Tambien dice algo de pool, pero me parece mucho lio

// tambien dice algo de prepared statements para evitar inyeccion sql por parte de atacantes, pero la práctica no pide nada así, conque paso

let pool; // aqui guardo la pool a la base de datos para no tener que hacer mysqlcreateConnection para cada peticion a la base de datos

const conseguirpool = async () => { // esta funcion solo la necesito porque al parecer hay dos formas de importar módulos de nodejs y openapi usa algo llamdo CommonJS y lo de la página de la que he sacado las referencias se usa ES Modules, conque la notación cambia y tengo que usar los awaits siempre dentro de async

  if(!pool) {// si aun no he hecho la pool a la base de datos, la hago
    pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dism',
      connectionLimit: 10,
      waitForConnections: true
    }); 
  }

  return pool;
}

/**
* GET usuario concreto por nombre
*
* usuario String Nombre del usuario
* returns Usuario
* */
const usuariosByNombreGET = ({ usuario }) => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool();
      const [filas] = await pool.execute(`SELECT * FROM usuarios WHERE usuario = ?`, [usuario]);
      const fila = filas[0];  // solo hay un objeto en la consulta (una fila) y es el que paso
      if(fila) {
        resolve(Service.successResponse(
          fila,
        ));
      }
      else {
        reject(Service.rejectResponse(
          `Usuario no encontrado`,
          404
        ));
      }
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500,
      ));
    }
  },
);
/**
* GET usuarios
*
* returns List
* */
const usuariosGET = () => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool(); // por si aun no he hecho la pool a la base de datos en otra peticion previa. Esto lo voy a poner en todas las peticiones, si ya existe no consume mucho proceso porque no entra en el if.
      
      const [filas] = await pool.execute('SELECT * FROM usuarios');
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
      await conseguirpool();
      await pool.execute(`DELETE FROM usuarios WHERE identificador = ?`, [identificador]);

      resolve(Service.successResponse({
        message: `Se ha borrado el usuario con identificador ${identificador}`
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
* returns Usuario
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
const usuariosIdentificadorPUT = ({ identificador, body }) => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool(); // por si aun no he hecho la pool a la base de datos en otra peticion previa. Esto lo voy a poner en todas las peticiones, si ya existe no consume mucho proceso porque no entra en el if.
      const usuario = body;
      await pool.execute('UPDATE usuarios SET identificador = ?, nombre = ?, usuario = ?, clave = ?, isAdmin = ? WHERE identificador = ?', [usuario.nuevoID, usuario.nombre, usuario.usuario, usuario.clave, usuario.isAdmin, identificador]);
      resolve(Service.successResponse({
        identificador,
        usuario,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        usuario,
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
const usuariosPOST = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const usuario = body;
      await conseguirpool();

      let id = parseInt(usuario.identificador);
      
      
      await pool.execute(`INSERT INTO usuarios (identificador, nombre, usuario, clave, isAdmin) VALUES (?, ?, ?, ?, ?)`, [id, usuario.nombre, usuario.usuario, usuario.clave, usuario.isAdmin]);
      resolve(Service.successResponse({
        message: 'Usuario creado correctamente'
      }));
    } catch (e) {
      console.error('ERROR EN usuariosPOST:', e.message);
      console.error('STACK:', e.stack);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  usuariosByNombreGET,
  usuariosGET,
  usuariosIdentificadorDELETE,
  usuariosIdentificadorGET,
  usuariosIdentificadorPUT,
  usuariosPOST,
};
