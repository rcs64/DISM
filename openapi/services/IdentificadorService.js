/* eslint-disable no-unused-vars */
const Service = require('./Service');

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

module.exports = {
  trabajosIdentificadorGET,
  usuariosIdentificadorGET,
};
