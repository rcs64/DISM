/**
 * The FichajesController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/FichajesService');
const fichajesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesGET);
};

const fichajesIdentificadorDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdentificadorDELETE);
};

const fichajesIdentificadorGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdentificadorGET);
};

const fichajesIdentificadorPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdentificadorPUT);
};

const fichajesNombreUsuarioGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesNombreUsuarioGET);
};

const fichajesPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesPOST);
};

const fichajesUsuarioGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesUsuarioGET);
};


module.exports = {
  fichajesGET,
  fichajesIdentificadorDELETE,
  fichajesIdentificadorGET,
  fichajesIdentificadorPUT,
  fichajesNombreUsuarioGET,
  fichajesPOST,
  fichajesUsuarioGET,
};
