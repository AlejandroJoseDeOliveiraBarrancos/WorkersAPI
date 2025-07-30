import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { container } from './application/di/container';
import { TYPES } from './application/di/types';
import { Database } from './infrastructure/database/Database';
import { WorkerController } from './presentation/controllers/WorkerController';
import { VacationRequestController } from './presentation/controllers/VacationRequestController';
import { specs } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const database = container.get<Database>(TYPES.Database);

const workerController = container.get<WorkerController>(TYPES.WorkerController);
const vacationRequestController = container.get<VacationRequestController>(TYPES.VacationRequestController);

console.log('Swagger specs generated:', JSON.stringify(specs, null, 2));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Workers Vacation API Documentation'
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Workers Vacation Management API',
    version: '1.0.0',
    documentation: 'http://localhost:3000/api-docs',
    swagger: 'http://localhost:3000/api-docs',
    endpoints: {
      workers: {
        'POST /api/workers': 'Create a new worker',
        'GET /api/workers': 'Get all workers',
        'GET /api/workers/:id': 'Get worker by ID'
      },
      vacationRequests: {
        'POST /api/vacation-requests': 'Create a new vacation request',
        'PUT /api/vacation-requests/:id/approve': 'Approve a vacation request',
        'PUT /api/vacation-requests/:id/reject': 'Reject a vacation request',
        'GET /api/workers/:workerId/vacation-balance': 'Get worker vacation balance'
      }
    }
  });
});


app.post('/api/workers', (req, res) => workerController.createWorker(req, res));
app.get('/api/workers', (req, res) => workerController.getAllWorkers(req, res));
app.get('/api/workers/:id', (req, res) => workerController.getWorker(req, res));

app.post('/api/vacation-requests', (req, res) => vacationRequestController.createVacationRequest(req, res));
app.put('/api/vacation-requests/:id/approve', (req, res) => vacationRequestController.approveVacationRequest(req, res));
app.put('/api/vacation-requests/:id/reject', (req, res) => vacationRequestController.rejectVacationRequest(req, res));
app.get('/api/workers/:workerId/vacation-balance', (req, res) => vacationRequestController.getWorkerVacationBalance(req, res));

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

async function startServer() {
  try {
    await database.initialize();
    console.log('Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await database.close();
  process.exit(0);
});

startServer();
