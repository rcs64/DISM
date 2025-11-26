/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* GET apikey
*
* returns List
* */
const apikeyGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
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
* DELETE apikey
*
* identificador Integer 
* no response value expected for this operation
* */
const apikeyIdentificadorDELETE = ({ identificador }) => new Promise(
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
* GET apikey especifica
*
* identificador Integer 
* returns ApiKey
* */
const apikeyIdentificadorGET = ({ identificador }) => new Promise(
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
* POST apikey
*
* identificador Integer 
* apiKey ApiKey 
* no response value expected for this operation
* */
const apikeyIdentificadorPUT = ({ identificador, apiKey }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        identificador,
        apiKey,
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
* POST apikey
*
* apiKey ApiKey 
* no response value expected for this operation
* */
const apikeyPOST = ({ apiKey }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiKey,
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
  apikeyGET,
  apikeyIdentificadorDELETE,
  apikeyIdentificadorGET,
  apikeyIdentificadorPUT,
  apikeyPOST,
};
