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
* GET fichajes
*
* returns List
* */
const fichajesGET = () => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool(); // por si aun no he hecho la pool a la base de datos en otra peticion previa. Esto lo voy a poner en todas las peticiones, si ya existe no consume mucho proceso porque no entra en el if.
      
      const [filas] = await pool.execute('SELECT * FROM fichajes');
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
* GET fichajes por usuario
*
* idUsuario Integer 
* returns List
* */
const fichajesUsuarioGET = ({ idUsuario }) => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool();
      const [filas] = await pool.execute(`SELECT * FROM fichajes WHERE idUsuario = ${idUsuario}`);
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
* DELETE fichaje
*
* identificador Integer 
* no response value expected for this operation
* */
const fichajesIdentificadorDELETE = ({ identificador }) => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool();
      await pool.execute(`DELETE FROM fichajes WHERE identificador = ${identificador}`);
      resolve(Service.successResponse({
        message: `Se ha eliminado el fichaje con el identificador ${identificador}`,
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
* GET fichaje especifico
*
* identificador Integer 
* returns Fichaje
* */
const fichajesIdentificadorGET = ({ identificador }) => new Promise(
  async (resolve, reject) => {
    try {
      await conseguirpool();
      const [filas] = await pool.execute(`SELECT * FROM fichajes WHERE identificador = ${identificador}`);
      const fila = filas[0];  // solo hay un objeto en la consulta (una fila) y es el que paso
      if(fila) {
        resolve(Service.successResponse(
          fila,
        ));
      }
      else {
        reject(Service.rejectResponse(
          `Fichaje no encontrado`,
          404
        ));
      }
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* PUT fichaje
*
* identificador Integer 
* fichaje Fichaje 
* no response value expected for this operation
* */
const fichajesIdentificadorPUT = ({ identificador, body }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('PUT recibido - identificador:', identificador);
      console.log('PUT recibido - body:', JSON.stringify(body, null, 2));
      const fichaje = body;
      await conseguirpool();
      
      // Convertir la fecha ISO a formato MySQL compatible
      const fechaSalida = new Date(fichaje.fechaHoraSalida).toISOString().slice(0, 19).replace('T', ' ');
      
      if(body.admin === 0) {
        const query = `UPDATE fichajes 
          SET 
          fechaHoraSalida = ?,
          horasTrabajadas = ?
          WHERE identificador = ?`;
        console.log('Query SQL:', query);
        await pool.execute(query, [fechaSalida, fichaje.horasTrabajadas, identificador]);
      }
      else {
        // Admin: puede actualizar todos los campos
        const query = `UPDATE fichajes SET fechaHoraEntrada = ?, fechaHoraSalida = ?, horasTrabajadas = ?, idTrabajo = ?, idUsuario = ?, geoLat = ?, geoLong = ? WHERE identificador = ?`;
        await pool.execute(query, [fichaje.fechaHoraEntrada, fechaSalida, fichaje.horasTrabajadas, fichaje.idTrabajo, fichaje.idUsuario, fichaje.geoLat, fichaje.geoLong, identificador]);
      }

      resolve(Service.successResponse({
        message: `Se ha actualizado el fichaje con el identificador ${identificador}`,
      })); // pongo comillas en los objetos de fechas porque si no, se ralla mysql, necesita strings
    } catch (e) {
      console.error('ERROR en PUT:', e);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* POST fichaje
*
* fichaje Fichaje 
* no response value expected for this operation
* */
const fichajesPOST = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      /*
        OPENAPI ME PASA EL OBJETO FICHAJE ASÍ, NO SÉ POR QUÉ, TOCA HACERLO ASÍ AUNQUE IONIC LO PASASE BIEN.
        KEYS DE PARAMS: [ 'body' ]
        PARAMS COMPLETOS: {
          "body": {
            "fechaHoraEntrada": "...",
            ...
          }
        }
      */
      const fichaje = body;
      await conseguirpool();
      
      // Convertir la fecha ISO a formato MySQL compatible
      const fechaEntrada = new Date(fichaje.fechaHoraEntrada).toISOString().slice(0, 19).replace('T', ' ');
      
      await pool.execute(`INSERT INTO fichajes (fechaHoraEntrada, horasTrabajadas, idTrabajo, idUsuario, geoLat, geoLong) VALUES ('${fechaEntrada}', ${fichaje.horasTrabajadas}, ${fichaje.idTrabajo}, ${fichaje.idUsuario}, ${fichaje.geoLat}, ${fichaje.geoLong})`);
      resolve(Service.successResponse({
        message: 'Fichaje creado correctamente'
      }));
    } catch (e) {
      console.error('ERROR EN fichajesPOST:', e.message);
      console.error('STACK:', e.stack);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  fichajesGET,
  fichajesUsuarioGET,
  fichajesIdentificadorDELETE,
  fichajesIdentificadorGET,
  fichajesIdentificadorPUT,
  fichajesPOST,
};
