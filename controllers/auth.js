'use strict';

/**
 * Ticket Controller
 **/

var TicketModel = require('../models/ticket');
var Boom = require('boom');
var _ = require('lodash');
var moment = require('moment');
const authString = '5BaCPd450912376#u89o0';
module.exports = {
    verifyToken: function (string) {
        if(string == authString){
            return true
        }
    }
}