import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { CreateWorkerUseCase } from '../../application/use-cases/CreateWorkerUseCase';
import { GetWorkerUseCase } from '../../application/use-cases/GetWorkerUseCase';
import { GetAllWorkersUseCase } from '../../application/use-cases/GetAllWorkersUseCase';
import { TYPES } from '../../application/di/types';

/**
 * @swagger
 * components:
 *   schemas:
 *     Worker:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the worker
 *         code:
 *           type: string
 *           description: Worker code
 *         cedula:
 *           type: string
 *           description: Worker identification number
 *         name:
 *           type: string
 *           description: Worker full name
 *         hireDate:
 *           type: string
 *           format: date
 *           description: Date when the worker was hired
 *         area:
 *           type: string
 *           description: Worker department or area
 *         position:
 *           type: string
 *           description: Worker job position
 *         seniorityYears:
 *           type: number
 *           description: Number of years the worker has been employed
 *       required:
 *         - code
 *         - cedula
 *         - name
 *         - hireDate
 *         - area
 *         - position
 */

@injectable()
export class WorkerController {
  constructor(
    @inject(TYPES.CreateWorkerUseCase) private createWorkerUseCase: CreateWorkerUseCase,
    @inject(TYPES.GetWorkerUseCase) private getWorkerUseCase: GetWorkerUseCase,
    @inject(TYPES.GetAllWorkersUseCase) private getAllWorkersUseCase: GetAllWorkersUseCase
  ) {}

  /**
   * @swagger
   * /api/workers:
   *   post:
   *     summary: Create a new worker
   *     description: Creates a new worker with the provided information
   *     tags: [Workers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateWorkerRequest'
   *     responses:
   *       201:
   *         description: Worker created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Worker'
   *       400:
   *         description: Bad request - missing required fields or validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async createWorker(req: Request, res: Response): Promise<void> {
    try {
      const { code, cedula, name, hireDate, area, position } = req.body;

      // Validate required fields
      if (!code || !cedula || !name || !hireDate || !area || !position) {
        res.status(400).json({
          error: 'Missing required fields: code, cedula, name, hireDate, area, position'
        });
        return;
      }

      const request = {
        code,
        cedula,
        name,
        hireDate: new Date(hireDate),
        area,
        position
      };

      const result = await this.createWorkerUseCase.execute(request);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating worker:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * @swagger
   * /api/workers/{id}:
   *   get:
   *     summary: Get worker by ID
   *     description: Retrieves a worker by their unique identifier
   *     tags: [Workers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Worker ID
   *     responses:
   *       200:
   *         description: Worker found successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Worker'
   *       404:
   *         description: Worker not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getWorker(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Worker ID is required'
        });
        return;
      }

      const result = await this.getWorkerUseCase.execute(id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting worker:', error);
      res.status(404).json({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * @swagger
   * /api/workers:
   *   get:
   *     summary: Get all workers
   *     description: Retrieves a list of all workers
   *     tags: [Workers]
   *     responses:
   *       200:
   *         description: List of workers retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Worker'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getAllWorkers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getAllWorkersUseCase.execute();
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting all workers:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
} 