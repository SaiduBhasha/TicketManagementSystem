'use strict';
/**
 * API Routes
 **/
var Joi = require('joi'),
  ctrl = require('../controllers');

var apiRoutes = [
  {
    method: 'POST',
    path: '/api/ticket',
    config: {
      handler: ctrl.ticket.create,
      tags: ['api'],
      description: 'Save ticket data',
      notes: 'Save ticket data',
      validate: {
        payload: {
          customerName: Joi.string().trim().min(3).max(100).required(),
          ticketPrice: Joi.number().required(),
          performanceTitle: Joi.string().trim().required(),
          performanceTime: Joi.string().trim().required().example('bhasha'),
          creationDate: Joi.date().optional(),
        },
        // headers: Joi.object({
        //   'auth-token': Joi.string().required(),
        // }).options({ allowUnknown: true }),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/api/ticket/{id}',
    config: {
      handler: ctrl.ticket.delete,
      description: 'Remove specific ticket data',
      notes: 'Remove specific ticket data',
      tags: ['api'],
      validate: {
        params: {
          id: Joi.string().required(),
        },
        // headers: Joi.object({
        //   'auth-token': Joi.string().required(),
        // }).options({ allowUnknown: true }),
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/ticket/{id}',
    config: {
      handler: ctrl.ticket.updateById,
      tags: ['api'],
      description: 'Update specific ticket data',
      notes: 'Update specific ticket data',

      // Joi api validation
      validate: {
        params: {
          id: Joi.string().required(),
        },
        payload: {
          customerName: Joi.string().trim().min(3).max(100),
          ticketPrice: Joi.number(),
          performanceTitle: Joi.string().trim(),
          performanceTime: Joi.string().trim(),
          creationDate: Joi.date().optional(),
        },
        // headers: Joi.object({
        //   'auth-token': Joi.string().required(),
        // }).options({ allowUnknown: true }),
      },
    },
  },
  {
    method: 'GET',
    //Getting data for particular ticket "/api/ticket/1212313123"
    path: '/api/ticket/{id}',
    config: {
      handler: ctrl.ticket.fetchById,
      tags: ['api'],
      description: 'Get specific ticket data',
      notes: 'Get specific ticket data',
      validate: {
        // Id is required field
        params: {
          id: Joi.string().required(),
        },
        // headers: Joi.object({
        //   'auth-token': Joi.string().required(),
        // }).options({ allowUnknown: true }),
      },
    },
  },
  {
    method: 'GET',
    path: '/api/ticket',
    config: {
      handler: ctrl.ticket.fetchAll,
      tags: ['api'],
      description: 'Get All ticket data',
      notes: 'Get All ticket data',
      // validate: {
      //   headers: Joi.object({
      //     'auth-token': Joi.string().required(),
      //   }).options({ allowUnknown: true }),
      // },
    },
  },
  {
    method: 'GET',
    path: '/api/analytics/earned',
    config: {
      handler: ctrl.ticket.earned,
      tags: ['api'],
      description: 'Get earned data',
      notes: 'Get earned data',
      validate: {
        query: {
          fromDate: Joi.string(),
          toDate: Joi.string(),
          method: Joi.string(),
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/api/analytics/visited',
    config: {
      handler: ctrl.ticket.visited,
      tags: ['api'],
      description: 'Get earned data',
      notes: 'Get earned data',
      validate: {
        query: {
          fromDate: Joi.string(),
          toDate: Joi.string(),
          method: Joi.string(),
        },
        // headers: Joi.object({
        //   'auth-token': Joi.string().required(),
        // }).options({ allowUnknown: true }),
      },
    },
  },
];

module.exports = apiRoutes;
