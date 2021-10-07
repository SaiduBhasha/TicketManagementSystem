'use strict';

/**
 * Ticket Controller
 **/

var TicketModel = require('../models/ticket');
var auth = require('./auth');
var Boom = require('boom');
var _ = require('lodash');
var moment = require('moment');
const authString = '5BaCPd450912376#u89o0';
module.exports = {
  create: async function (request, reply) {
    var tokenVal = await auth.verifyToken(authString);
    if (!tokenVal) {
      return reply({
        statusCode: 500,
        message: 'Authentication Failed',
      });
    }
    // Create mongodb ticket object to save it into database
    var ticket = new TicketModel(request.payload);
    //Call save methods to save data into database and pass callback methods to handle error
    ticket.save(function (error) {
      if (error) {
        reply({
          statusCode: 503,
          message: error,
        });
      } else {
        reply({
          statusCode: 201,
          message: 'Ticket Saved Successfully',
        });
      }
    });
  },
  delete: async function (request, reply) {
    var tokenVal = await auth.verifyToken(authString);
    if (!tokenVal) {
      return reply({
        statusCode: 500,
        message: 'Authentication Failed',
      });
    }
    TicketModel.findOneAndRemove({ _id: request.params.id }, function (error) {
      if (error) {
        reply({
          statusCode: 503,
          message: 'Error in removing Ticket',
          data: error,
        });
      } else {
        reply({
          statusCode: 200,
          message: 'Ticket Deleted Successfully',
        });
      }
    });
  },
  updateById: async function (request, reply) {
    var tokenVal = await auth.verifyToken(authString);
    if (!tokenVal) {
      return reply({
        statusCode: 500,
        message: 'Authentication Failed',
      });
    }
    TicketModel.findOneAndUpdate(
      { _id: request.params.id },
      request.payload,
      function (error, data) {
        if (error) {
          reply({
            statusCode: 503,
            message: 'Failed to get data',
            data: error,
          });
        } else {
          reply({
            statusCode: 200,
            message: 'Ticket Updated Successfully',
            data: data,
          });
        }
      }
    );
  },
  fetchById: async function (request, reply) {
    var tokenVal = await auth.verifyToken(authString);
    if (!tokenVal) {
      return reply({
        statusCode: 500,
        message: 'Authentication Failed',
      });
    }
    //Finding ticket for particular ticketID
    TicketModel.find({ _id: request.params.id }, function (error, data) {
      if (error) {
        reply({
          statusCode: 503,
          message: 'Failed to get data',
          data: error,
        });
      } else {
        if (data.length === 0) {
          reply({
            statusCode: 200,
            message: 'Ticket Not Found',
            data: data,
          });
        } else {
          reply({
            statusCode: 200,
            message: 'Ticket Data Successfully Fetched',
            data: data,
          });
        }
      }
    });
  },
  fetchAll: async function (request, reply) {
    var tokenVal = await auth.verifyToken(authString);
    if (!tokenVal) {
      return reply({
        statusCode: 500,
        message: 'Authentication Failed',
      });
    }
    console.log(request.headers['auth-token']);
    //Fetch all data from mongodb Ticket Collection
    TicketModel.find({}, function (error, data) {
      if (error) {
        reply({
          statusCode: 503,
          message: 'Failed to get data',
          data: error,
        });
      } else {
        reply({
          statusCode: 200,
          message: 'Ticket Data Successfully Fetched',
          data: data,
        });
      }
    });
  },
  earned: async function (request, reply) {
    var tokenVal = await auth.verifyToken(authString);
    if (!tokenVal) {
      return reply({
        statusCode: 500,
        message: 'Authentication Failed',
      });
    }
    var query = request.query;
    console.log(query);
    var fromDate = new Date(
      new Date(new Date(query.fromDate)).setHours(0, 0, 0, 0)
    );
    var toDate = new Date(new Date(query.toDate).setHours(23, 59, 59, 0));
    if (query.method == 'algorithm') {
      TicketModel.find({}, function (error, data) {
        if (error) {
          reply({
            statusCode: 503,
            message: 'Failed to get data',
            data: error,
          });
        } else {
          var sd = new Date(fromDate).getTime();
          var ed = new Date(toDate).getTime();
          data = data.filter((d) => {
            var time = new Date(d.creationDate).getTime();
            return time >= sd && time <= ed;
          });
          const monthNames = [
            'January',
            'Febraury',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];

          var map_result = _.map(data, function (item) {
            var d = new Date(item.creationDate).getTime();
            console.log(new Date(d).getMonth());
            var month = monthNames[new Date(d).getMonth()];
            return {
              Month: month,
              Price: item.ticketPrice,
            };
          });
          let output = [];
          let uniqueMonth = Array.from(new Set(map_result.map((x) => x.Month)));
          uniqueMonth.forEach((n) => {
            output.push(
              map_result
                .filter((x) => x.Month === n)
                .reduce((a, item) => {
                  let val =
                    a['Month'] === undefined
                      ? item.Price
                      : a['Price'] + item.Price;

                  return { Month: n, Price: val };
                }, {})
            );
          });
          reply({
            statusCode: 200,
            message: 'Successfully Fetched Data',
            data: output,
          });
        }
      });
    } else if (query.method == 'aggregation') {
      TicketModel.aggregate(
        [
          {
            $match: {
              creationDate: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
              },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: '$creationDate' },
              },
              price: { $sum: '$ticketPrice' },
            },
          },
          {
            $project: {
              summaryProfit: '$price',
              month: '$_id.month',
              _id: 0,
            },
          },
          {
            $addFields: {
              month: {
                $let: {
                  vars: {
                    monthsInString: [
                      ,
                      'January',
                      'Febraury',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                  },
                  in: {
                    $arrayElemAt: ['$$monthsInString', '$month'],
                  },
                },
              },
            },
          },
        ],
        function (error, data) {
          if (error) {
            reply({
              statusCode: 503,
              message: 'Failed to get data',
              data: error,
            });
          } else {
            reply({
              statusCode: 200,
              message: 'Ticket Data Successfully Fetched',
              data: data,
            });
          }
        }
      );
    } else {
      reply({
        statusCode: 200,
        message:
          'Failed to fetch Data,please choose method as aggregation or algorithm',
        data: [],
      });
    }
  },
  visited: async function (request, reply) {
    var tokenVal = await auth.verifyToken(authString);
    if (!tokenVal) {
      return reply({
        statusCode: 500,
        message: 'Authentication Failed',
      });
    }
    var query = request.query;
    var fromDate = new Date(
      new Date(new Date(query.fromDate)).setHours(0, 0, 0, 0)
    );
    var toDate = new Date(new Date(query.toDate).setHours(23, 59, 59, 0));
    if (query.method == 'algorithm') {
      TicketModel.find({}, function (error, data) {
        if (error) {
          reply({
            statusCode: 503,
            message: 'Failed to get data',
            data: error,
          });
        } else {
          var sd = new Date(fromDate).getTime();
          var ed = new Date(toDate).getTime();
          data = data.filter((d) => {
            var time = new Date(d.performanceTime).getTime();
            return time >= sd && time <= ed;
          });
          const monthNames = [
            'January',
            'Febraury',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];

          var map_result = _.map(data, function (item) {
            var d = new Date(item.performanceTime).getTime();
            console.log(new Date(d).getMonth());
            var month = monthNames[new Date(d).getMonth()];
            return {
              Month: month,
              Count: 1,
            };
          });
          let output = [];
          let uniqueMonth = Array.from(new Set(map_result.map((x) => x.Month)));
          uniqueMonth.forEach((n) => {
            output.push(
              map_result
                .filter((x) => x.Month === n)
                .reduce((a, item) => {
                  let val =
                    a['Month'] === undefined
                      ? item.Count
                      : a['Count'] + item.Count;

                  return { Month: n, Count: val };
                }, {})
            );
          });
          reply({
            statusCode: 200,
            message: 'Successfully Fetched Data',
            data: output,
          });
        }
      });
    } else if (query.method == 'aggregation') {
      TicketModel.aggregate(
        [
          {
            $match: {
              performanceTime: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
              },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: '$performanceTime' },
              },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              summaryvisits: '$count',
              month: '$_id.month',
              _id: 0,
            },
          },
          {
            $addFields: {
              month: {
                $let: {
                  vars: {
                    monthsInString: [
                      ,
                      'January',
                      'Febraury',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                  },
                  in: {
                    $arrayElemAt: ['$$monthsInString', '$month'],
                  },
                },
              },
            },
          },
        ],
        function (error, data) {
          if (error) {
            reply({
              statusCode: 503,
              message: 'Failed to get data',
              data: error,
            });
          } else {
            reply({
              statusCode: 200,
              message: 'Ticket Data Successfully Fetched',
              data: data,
            });
          }
        }
      );
    } else {
      reply({
        statusCode: 200,
        message:
          'Failed to fetch Data,please choose method as aggregation or algorithm',
        data: [],
      });
    }
  },
  groupmonth: function (value, index, array) {
    let bymonth = {};
    d = new Date(value['date']);
    d = (d.getFullYear() - 1970) * 12 + d.getMonth();
    bymonth[d] = bymonth[d] || [];
    bymonth[d].push(value);
    return bymonth;
  },
};
