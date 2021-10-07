'use strict';

const { time } = require('console');

var mongoose = require('mongoose'),
  shortid = require('shortid'),
  Schema = mongoose.Schema;

/**
 * @module Ticket
 * @description contain the details of Attribute
 */

var TicketSchema = new Schema({
  ticketId: {
    type: String,
    unique: true,
    default: shortid.generate,
  },
  /** 
    customer Name. It can only contain string, is required field.
  */
  customerName: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now() },
  performanceTitle: { type: String, required: true },
  performanceTime: { type: Date, required: true },
});

module.exports = mongoose.model('Ticket', TicketSchema);
