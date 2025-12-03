/* eslint-disable no-unused-vars */
const Service = require('./Service');
const mysql = require('mysql2/promise');

// https://sidorares.github.io/node-mysql2/docs aqui explica como hacer la conexion y las peticiones pero usa otro modelo de node, conque he usado ia para pedirle que me explique los cambios de notacion y como aplicarlos a mi codigo

// https://sidorares.github.io/node-mysql2/docs#using-prepared-statements aqui usa lo de await de conseguir la conexion. Tambien dice algo de pool, pero me parece mucho lio

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
* GET trabajos
*
* returns List
* */
const trabajosGET = () => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool(); // por si aun no he hecho la conexion a la base de datos en otra peticion previa. Esto lo voy a poner en todas las peticiones, si ya existe no consume mucho proceso porque no entra en el if.
      
      const [filas] = await pool.execute('SELECT * FROM trabajos');
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
* DELETE trabajo
*
* identificador Integer 
* no response value expected for this operation
* */
const trabajosIdentificadorDELETE = ({ identificador }) => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool();
      await pool.execute(`DELETE FROM trabajos WHERE identificador = ${identificador}`);
      resolve(Service.successResponse({
        message: `Se ha eliminado el trabajo con el identificador ${identificador}`,
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
* GET trabajo concreto
*
* identificador Integer Id del trabajo
* returns List
* */
const trabajosIdentificadorGET = ({ identificador }) => new Promise(
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
* PUT trabajo
*
* identificador Integer 
* trabajo Trabajo 
* no response value expected for this operation
* */
const trabajosIdentificadorPUT = ({ identificador, body }) => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool(); // por si aun no he hecho la pool a la base de datos en otra peticion previa. Esto lo voy a poner en todas las peticiones, si ya existe no consume mucho proceso porque no entra en el if.
      const trabajo = body;
      await pool.execute('UPDATE trabajos SET identificador = ?, nombre = ? WHERE identificador = ?', [trabajo.nuevoID, trabajo.nombre, identificador]);
      resolve(Service.successResponse({
        identificador,
        trabajo,
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
* POST trabajos
*
* trabajo Trabajo 
* no response value expected for this operation
* */
const trabajosPOST = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const trabajo = body;
      await conseguirpool();

      let id = parseInt(trabajo.identificador);
      
      
      await pool.execute(`INSERT INTO trabajos (identificador, nombre) VALUES (?, ?)`, [id, trabajo.nombre]);
      resolve(Service.successResponse({
        message: 'Trabajo creado correctamente'
      }));
    } catch (e) {
      console.error('ERROR EN trabajosPOST:', e.message);
      console.error('STACK:', e.stack);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  trabajosGET,
  trabajosIdentificadorDELETE,
  trabajosIdentificadorGET,
  trabajosIdentificadorPUT,
  trabajosPOST,
};
