import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workers Vacation Management API',
      version: '1.0.0',
      description: 'A RESTful API for managing worker vacations with clean architecture',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Worker: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the worker'
            },
            code: {
              type: 'string',
              description: 'Worker code'
            },
            cedula: {
              type: 'string',
              description: 'Worker identification number'
            },
            name: {
              type: 'string',
              description: 'Worker full name'
            },
            hireDate: {
              type: 'string',
              format: 'date',
              description: 'Date when the worker was hired'
            },
            area: {
              type: 'string',
              description: 'Worker department or area'
            },
            position: {
              type: 'string',
              description: 'Worker job position'
            },
            seniorityYears: {
              type: 'number',
              description: 'Number of years the worker has been employed'
            }
          },
          required: ['code', 'cedula', 'name', 'hireDate', 'area', 'position']
        },
        CreateWorkerRequest: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Worker code'
            },
            cedula: {
              type: 'string',
              description: 'Worker identification number'
            },
            name: {
              type: 'string',
              description: 'Worker full name'
            },
            hireDate: {
              type: 'string',
              format: 'date',
              description: 'Date when the worker was hired'
            },
            area: {
              type: 'string',
              description: 'Worker department or area'
            },
            position: {
              type: 'string',
              description: 'Worker job position'
            }
          },
          required: ['code', 'cedula', 'name', 'hireDate', 'area', 'position']
        },
        VacationRequest: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the vacation request'
            },
            workerId: {
              type: 'string',
              description: 'ID of the worker requesting vacation'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Start date of the vacation'
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'End date of the vacation'
            },
            days: {
              type: 'number',
              description: 'Number of vacation days requested'
            },
            hours: {
              type: 'number',
              description: 'Number of vacation hours requested'
            },
            type: {
              type: 'string',
              enum: ['days', 'hours'],
              description: 'Type of vacation request (days or hours)'
            },
            reason: {
              type: 'string',
              description: 'Reason for the vacation request'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              description: 'Current status of the vacation request'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the request was created'
            },
            approvedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the request was approved'
            },
            rejectedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the request was rejected'
            },
            approvedBy: {
              type: 'string',
              description: 'Who approved the request'
            },
            totalTimeInDays: {
              type: 'number',
              description: 'Total vacation time in days'
            }
          },
          required: ['workerId', 'startDate', 'endDate', 'days', 'hours', 'type', 'reason']
        },
        CreateVacationRequestRequest: {
          type: 'object',
          properties: {
            workerId: {
              type: 'string',
              description: 'ID of the worker requesting vacation'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Start date of the vacation'
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'End date of the vacation'
            },
            days: {
              type: 'number',
              description: 'Number of vacation days requested'
            },
            hours: {
              type: 'number',
              description: 'Number of vacation hours requested'
            },
            type: {
              type: 'string',
              enum: ['days', 'hours'],
              description: 'Type of vacation request (days or hours)'
            },
            reason: {
              type: 'string',
              description: 'Reason for the vacation request'
            }
          },
          required: ['workerId', 'startDate', 'endDate', 'days', 'hours', 'type', 'reason']
        },
        VacationBalance: {
          type: 'object',
          properties: {
            workerId: {
              type: 'string',
              description: 'ID of the worker'
            },
            totalDays: {
              type: 'number',
              description: 'Total vacation days available'
            },
            usedDays: {
              type: 'number',
              description: 'Number of vacation days used'
            },
            availableDays: {
              type: 'number',
              description: 'Number of vacation days remaining'
            },
            pendingRequests: {
              type: 'number',
              description: 'Number of pending vacation requests'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/presentation/controllers/*.ts', './dist/presentation/controllers/*.js']
};

export const specs = swaggerJsdoc(options); 